import { createServer } from 'node:http'
import { randomBytes, createHash, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import nodemailer from 'nodemailer'
import { catalog, genres, item, marvelOrder, newList, ratings, slug } from './catalog.mjs'

const production = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3000)
const appUrl = new URL(process.env.APP_URL || `http://localhost:${port}`)
const secure = appUrl.protocol === 'https:'
const tmdbToken = process.env.TMDB_READ_TOKEN
const tmdbKey = process.env.TMDB_API_KEY
const onlineSearch = Boolean(tmdbToken || tmdbKey)
const smtp = process.env.SMTP_URL ? nodemailer.createTransport(process.env.SMTP_URL) : null
if (production && (!secure || !smtp || !process.env.MAIL_FROM)) {
  throw new Error('APP_URL (HTTPS), SMTP_URL und MAIL_FROM sind erforderlich.')
}
const dataDir = process.env.DATA_DIR || 'data'
mkdirSync(dataDir, { recursive: true, mode: 0o700 })
const db = new DatabaseSync(join(dataDir, 'watchlist.sqlite'))
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0, verify_hash TEXT, verify_expires INTEGER, list TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS households (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS household_members (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS household_invites (
    id INTEGER PRIMARY KEY,
    household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    email TEXT NOT NULL, expires INTEGER NOT NULL, UNIQUE (household_id, email)
  );
`)
const monthFormatter = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', month: 'numeric' })
const day = 86_400_000
const hash = token => createHash('sha256').update(token).digest('hex')
const token = () => randomBytes(32).toString('base64url')
const fail = (status, message) => Object.assign(new Error(message), { status })
function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}
function matches(password, saved) {
  return timingSafeEqual(Buffer.from(passwordHash(password, saved.split(':')[0])), Buffer.from(saved))
}
function sessionId(req) {
  return /(?:^|;\s*)watch_session=([\w-]{43})(?:;|$)/.exec(req.headers.cookie || '')?.[1]
}
function getUser(req) {
  const id = sessionId(req)
  if (!id) return null
  return db.prepare('SELECT users.* FROM users JOIN sessions ON users.id = sessions.user_id WHERE hash = ? AND expires > ?').get(hash(id), Date.now())
}
function sessionCookie(value, maxAge) {
  return `watch_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}
function startSession(res, userId) {
  const id = token()
  db.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now())
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(hash(id), userId, Date.now() + 30 * day)
  res.setHeader('Set-Cookie', sessionCookie(id, 30 * 86400))
}
const staticFiles = new Map([
  ['/app.js',['app.js','text/javascript; charset=utf-8']],
  ['/style.css',['style.css','text/css; charset=utf-8']], ['/stills.webp',['stills.webp','image/webp']],
  ['/hero.webp',['hero.webp','image/webp']],
])
const versionedAssets = new Map()
let index = readFileSync(new URL('./public/index.html', import.meta.url), 'utf8')
for (const path of ['/app.js', '/style.css']) {
  const [file, type] = staticFiles.get(path)
  const bytes = readFileSync(new URL(`./public/${file}`, import.meta.url))
  const versionedPath = `/assets/${hash(bytes).slice(0, 16)}/${file}`
  versionedAssets.set(versionedPath, { bytes, type })
  index = index.replace(`"${path}"`, `"${versionedPath}"`)
}
function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}
async function body(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw fail(415, 'JSON erforderlich.')
  let incoming = ''
  for await (const part of req) {
    incoming += part
    if (incoming.length > 32768) throw fail(413, 'Die Eingabe ist zu lang.')
  }
  try {
    const value = JSON.parse(incoming)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error()
    return value
  } catch {
    throw fail(400, 'Ungültige Eingabe.')
  }
}
function eligible(title, entries) {
  return !title.predecessor || ['seen','excluded'].includes(entries[title.predecessor]?.status)
}
function currentMarvel(entries) {
  return marvelOrder.find(id => !['seen','excluded'].includes(entries[id]?.status))
}
function genreWeights(list) {
  const weights = new Map()
  for (const [id, record] of Object.entries(list.entries)) {
    if (record.status !== 'seen') continue
    const strength = record.rating.startsWith('Lieblings') ? 3 :
      record.rating === 'Sehr gut' ? 2 : record.rating === 'Gut' ? 1 : record.rating === 'Schlecht' ? -2 : 0
    const title = catalog.get(id) || list.custom[id]
    for (const genre of list.media?.[id]?.genres || title?.genres || []) weights.set(genre, (weights.get(genre) || 0) + strength)
  }
  for (const genre of list.interests || []) weights.set(genre, (weights.get(genre) || 0) + 8)
  return weights
}
function searchInterests(list) {
  const inferred = [...genreWeights(list)].filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]).slice(0, 4).map(([genre]) => genre)
  return [...new Set([...(list.interests || []), ...inferred])]
}
function fill(list) {
  const { entries, custom } = list
  const weights = genreWeights(list)
  const score = entry => {
    const tags = list.media?.[entry.id]?.genres || entry.genres
    return tags.reduce((total, genre) => total + (weights.get(genre) || 0), 0) / Math.max(1, tags.length)
  }
  const all = new Map([...catalog, ...Object.values(custom).map(entry => [entry.id, entry])])
  const active = Object.keys(entries).filter(id => entries[id].status === 'open' && !marvelOrder.includes(id))
  const hasFilm = active.some(id => all.get(id)?.type === 'film')
  const changed = []
  while (active.length < 15) {
    const candidates = [...all.values()].filter(entry => eligible(entry, entries) &&
      (entries[entry.id]?.status === 'reserve' || (!entries[entry.id] && entry.pool === 'discovery')))
    const requireFilm = !hasFilm && !changed.some(entry => entry.type === 'film')
    const match = entry => !requireFilm || entry.type === 'film'
    candidates.sort((a, b) => {
      const priority = entry => Number(entries[entry.id]?.status === 'reserve')
      return priority(b) - priority(a) || score(b) - score(a) || Number(Boolean(b.tmdb)) - Number(Boolean(a.tmdb))
    })
    const next = candidates.find(match) || candidates[0]
    if (!next) break
    entries[next.id] = { status: 'open', rating: '', suggested: entries[next.id]?.status !== 'reserve' }
    active.push(next.id)
    changed.push(next)
  }
  return changed.map(entry => entry.title)
}
function view(list, user) {
  const { entries, custom, rewatch } = list
  const nextMarvel = currentMarvel(entries)
  const today = Date.now()
  const available = id => catalog.get(id) || custom[id]
  const titles = Object.entries(entries)
    .filter(([id, record]) => id !== nextMarvel && available(id) && (record.status !== 'reserve' || eligible(available(id), entries)))
    .map(([id, record]) => ({ ...available(id), ...list.media?.[id], ...record }))
  const current = nextMarvel ? { ...catalog.get(nextMarvel), ...list.media?.[nextMarvel], status: 'open', ...entries[nextMarvel] } : null
  const seasonal = monthFormatter.format(today) === '12'
    ? [...catalog.values()].filter(entry => entry.pool === 'seasonal' && !entries[entry.id]) : []
  const favorites = titles.filter(entry => entry.status === 'seen' && entry.rating.startsWith('Lieblings') &&
    (rewatch[entry.id]?.offeredAt === rewatch[entry.id]?.acknowledgedAt
      ? today - Math.max(entry.seenAt || 0, rewatch[entry.id]?.offeredAt || 0) >= 183 * day
      : Boolean(rewatch[entry.id]?.offeredAt)))
  return { user: user ? { email: user.email } : null, titles, marvel: current, seasonal, favorites, genres, ratings, interests: list.interests || [], onlineSearch }
}
function save(user, list) {
  db.prepare('UPDATE users SET list = ? WHERE id = ?').run(JSON.stringify(list), user.id)
}
function offerFavorites(user, list) {
  const now = Date.now()
  let changed = false
  for (const [id, record] of Object.entries(list.entries)) {
    if (record.status !== 'seen' || !record.rating.startsWith('Lieblings')) continue
    const prior = list.rewatch[id]
    if (prior?.offeredAt !== prior?.acknowledgedAt || now - Math.max(record.seenAt || 0, prior?.offeredAt || 0) < 183 * day) continue
    list.rewatch[id] = { offeredAt: now }
    changed = true
  }
  if (changed) save(user, list)
}
const attempts = new Map()
function throttle(key, limit) {
  const now = Date.now()
  if (attempts.size > 2000) for (const [id, info] of attempts) if (info.until <= now) attempts.delete(id)
  const old = attempts.get(key)
  const entry = old && old.until > now ? old : { count: 0, until: now + 15 * 60_000 }
  if (entry.count >= limit) throw fail(429, 'Zu viele Versuche. Bitte versuche es später erneut.')
  entry.count++
  attempts.set(key, entry)
}
const validEmail = email => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function membership(userId) {
  return db.prepare('SELECT households.* FROM households JOIN household_members ON households.id = household_id WHERE user_id = ?').get(userId)
}
function householdRecommendations(lists) {
  const candidates = new Map()
  const blocked = new Set()
  const identities = entry => [`title:${slug(entry.title)}`, ...(entry.tmdb ? [entry.tmdb] : [])]
  const profiles = lists.map(list => {
    const weights = genreWeights(list)
    const picks = new Set()
    for (const [id, record] of Object.entries(list.entries)) {
      const title = catalog.get(id) || list.custom[id]
      if (!title) continue
      const entry = { ...title, ...list.media?.[id] }
      if (['seen','watching','excluded'].includes(record.status)) {
        for (const identity of identities(entry)) blocked.add(identity)
        if (record.status === 'seen' && !record.rating) {
          for (const genre of entry.genres) weights.set(genre, (weights.get(genre) || 0) + 1)
        }
      }
      if (['open','reserve'].includes(record.status) && !entry.predecessor && !['marvel','seasonal'].includes(entry.pool)) {
        picks.add(identities(entry)[0])
        candidates.set(identities(entry)[0], entry)
      }
    }
    const scale = Math.max(8, ...weights.values())
    return { weights, picks, scale }
  })
  for (const entry of catalog.values()) {
    if (entry.pool === 'discovery' && !entry.predecessor && !candidates.has(identities(entry)[0])) candidates.set(identities(entry)[0], entry)
  }
  return [...candidates.values()].filter(entry => !identities(entry).some(identity => blocked.has(identity)))
    .map(entry => {
      const scores = profiles.map(({ weights, picks, scale }) => {
        const interest = Math.max(0, ...entry.genres.map(genre => weights.get(genre) || 0)) / scale
        return interest + (picks.has(identities(entry)[0]) ? 0.35 : 0)
      })
      return { entry, score: Math.min(...scores) + scores.reduce((sum, n) => sum + n, 0) / scores.length }
    })
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'de'))
    .slice(0, 12)
    .map(({ entry }) => {
      const { id, tmdb, title, type, genres, poster, description, extent, year, provider, verifiedProvider } = entry
      return { id, tmdb, title, type, genres, poster, description, extent, year, provider, verifiedProvider }
    })
}
function householdView(user) {
  const household = membership(user.id)
  if (!household) {
    const invitations = db.prepare(`SELECT household_invites.id, households.name FROM household_invites
      JOIN households ON households.id = household_id WHERE email = ? AND expires > ? ORDER BY household_invites.id DESC`).all(user.email, Date.now())
    return { household: null, invitations, recommendations: [] }
  }
  const members = db.prepare(`SELECT email, list FROM users JOIN household_members ON users.id = user_id
    WHERE household_id = ? ORDER BY users.id`).all(household.id)
  return {
    household: { name: household.name, members: members.map(member => member.email) },
    invitations: [],
    recommendations: members.length >= 2 ? householdRecommendations(members.map(member => JSON.parse(member.list))) : [],
  }
}
function householdAction(user, input) {
  const current = membership(user.id)
  if (input.action === 'leave') {
    if (!current) return
    db.prepare(`DELETE FROM household_invites WHERE household_id = ? AND email = ?`).run(current.id, user.email)
    db.prepare('DELETE FROM household_members WHERE user_id = ?').run(user.id)
    db.prepare('DELETE FROM households WHERE id = ? AND NOT EXISTS (SELECT 1 FROM household_members WHERE household_id = ?)').run(current.id, current.id)
    return
  }
  if (input.action === 'create') {
    if (current) throw fail(409, 'Du gehörst bereits zu einem Haushalt.')
    const name = typeof input.name === 'string' ? input.name.trim() : ''
    if (name.length < 2 || name.length > 60) throw fail(400, 'Der Haushaltsname braucht 2 bis 60 Zeichen.')
    const { lastInsertRowid } = db.prepare('INSERT INTO households (name) VALUES (?)').run(name)
    db.prepare('INSERT INTO household_members VALUES (?, ?)').run(user.id, lastInsertRowid)
    return
  }
  if (input.action === 'accept' || input.action === 'decline') {
    if (!Number.isSafeInteger(input.id)) throw fail(400, 'Ungültige Einladung.')
    const invite = db.prepare('SELECT * FROM household_invites WHERE id = ? AND email = ? AND expires > ?').get(input.id, user.email, Date.now())
    if (!invite) throw fail(404, 'Diese Einladung ist abgelaufen oder gehört zu einer anderen E-Mail-Adresse.')
    if (input.action === 'accept') {
      if (current) throw fail(409, 'Verlasse zuerst deinen bisherigen Haushalt.')
      if (db.prepare('SELECT COUNT(*) AS count FROM household_members WHERE household_id = ?').get(invite.household_id).count >= 8) {
        throw fail(409, 'In diesem Haushalt sind bereits acht Personen.')
      }
      db.prepare('INSERT INTO household_members VALUES (?, ?)').run(user.id, invite.household_id)
    }
    db.prepare('DELETE FROM household_invites WHERE id = ?').run(invite.id)
    return
  }
  if (input.action !== 'invite') throw fail(400, 'Unbekannte Haushaltsaktion.')
  if (!current) throw fail(409, 'Erstelle zuerst einen Haushalt.')
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  if (!validEmail(email) || email === user.email) throw fail(400, 'Gib die E-Mail-Adresse der anderen Person ein.')
  const member = db.prepare('SELECT 1 FROM users JOIN household_members ON users.id = user_id WHERE email = ? AND household_id = ?').get(email, current.id)
  if (member) throw fail(409, 'Diese Person gehört bereits zum Haushalt.')
  throttle(`household-invite:${user.id}`, 10)
  db.prepare('DELETE FROM household_invites WHERE expires <= ?').run(Date.now())
  db.prepare(`INSERT INTO household_invites (household_id, email, expires) VALUES (?, ?, ?)
    ON CONFLICT (household_id, email) DO UPDATE SET expires = excluded.expires`).run(current.id, email, Date.now() + 7 * day)
  return { email, name: current.name }
}
function updateHousehold(user, input) {
  db.exec('BEGIN IMMEDIATE')
  try {
    const invite = householdAction(user, input)
    db.exec('COMMIT')
    return invite
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

async function sendVerification(email, verifyToken) {
  const link = new URL('/verify', appUrl)
  link.searchParams.set('token', verifyToken)
  if (smtp) {
    await smtp.sendMail({ from: process.env.MAIL_FROM, to: email, subject: 'AG Watchlist · E-Mail bestätigen',
      text: `Bestätige deine E-Mail für AG Watchlist: ${link}\nDieser Link ist 24 Stunden gültig.` })
  } else {
    console.info(`Entwicklung · Bestätigungslink für ${email}: ${link}`)
  }
}
const tmdbGenres = {
  Fantasy: [14, 10765], Mystery: [9648], Krimi: [80], Thriller: [53, 9648],
  Magie: [14, 10765], Übernatürliches: [14, 10765, 27], Action: [28, 10759],
  'Sci-Fi': [878, 10765], Humor: [35], Intrigen: [53, 18], Abenteuer: [12, 10759],
  Märchen: [14], Mythologie: [14, 36], Drama: [18], Historie: [36], Horror: [27],
  Romanze: [10749, 18], Dokumentation: [99], Animation: [16], Musik: [10402], Western: [37], Krieg: [10752, 10768],
}
async function tmdb(path, params) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  if (!tmdbToken) url.searchParams.set('api_key', tmdbKey)
  const headers = tmdbToken ? { Authorization: `Bearer ${tmdbToken}` } : {}
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(3500) })
  if (!response.ok) throw Error(`TMDB ${response.status}`)
  return response.json()
}
function mediaArtwork(result) {
  return {
    poster: typeof result.poster_path === 'string' && /^\/[\w.-]+$/.test(result.poster_path) ? result.poster_path : '',
    description: result.overview || '',
  }
}
const mediaGenres = {
  12: ['Abenteuer'], 14: ['Fantasy'], 16: ['Animation'], 18: ['Drama'], 27: ['Horror'],
  28: ['Action'], 35: ['Humor'], 36: ['Historie'], 37: ['Western'], 53: ['Thriller'],
  80: ['Krimi'], 99: ['Dokumentation'], 878: ['Sci-Fi'], 9648: ['Mystery'], 10402: ['Musik'],
  10749: ['Romanze'], 10751: ['Familie'], 10752: ['Krieg'], 10759: ['Action', 'Abenteuer'],
  10762: ['Kinder'], 10763: ['Nachrichten'], 10764: ['Reality'], 10765: ['Sci-Fi', 'Fantasy'],
  10766: ['Seifenoper'], 10767: ['Talkshow'], 10768: ['Krieg'], 10770: ['TV-Film'],
}
function genreTags(result) {
  return [...new Set((result.genres || result.genre_ids || []).flatMap(genre =>
    mediaGenres[genre.id ?? genre] || (genres.includes(genre.name) ? [genre.name] : [])))]
}
function mediaSummary(result, type) {
  return {
    tmdb: `${type}:${result.id}`,
    type: type === 'movie' ? 'film' : 'serie',
    title: result.title || result.name,
    original: result.original_title || result.original_name || '',
    genres: genreTags(result),
    year: (result.release_date || result.first_air_date || '').slice(0, 4),
    ...mediaArtwork(result),
  }
}
function mediaKey(list, media) {
  const titles = [media.title, media.original].filter(Boolean).map(slug)
  const saved = [...new Set([...Object.keys(list.entries), ...Object.keys(list.custom)])].find(id => list.media?.[id]?.tmdb === media.tmdb || list.custom[id]?.tmdb === media.tmdb)
  const identity = saved || titles.find(id => {
    const known = catalog.get(id) || (Object.hasOwn(list.custom, id) && list.custom[id])
    const tmdbId = list.media?.[id]?.tmdb || known?.tmdb
    return known?.type === media.type && (!tmdbId || tmdbId === media.tmdb)
  })
  const preferred = titles[0]
  if (identity) return identity
  if (preferred && !catalog.has(preferred) && !Object.hasOwn(list.custom, preferred) && !Object.hasOwn(list.entries, preferred)) return preferred
  return `tmdb-${media.tmdb.replace(':', '-')}`
}
const detailsCache = new Map()
async function mediaDetails(id) {
  if (typeof id !== 'string' || !/^(movie|tv):[1-9]\d{0,9}$/.test(id)) throw fail(400, 'Ungültiger Titel.')
  const stored = detailsCache.get(id)
  if (stored && stored.expires > Date.now()) return stored.value
  const [type, number] = id.split(':')
  const result = await tmdb(`${type}/${number}`, { language: 'de-DE', append_to_response: 'watch/providers' })
  const today = new Date().toISOString().slice(0, 10)
  const seasons = (result.seasons || [])
    .filter(season => Number.isInteger(season.season_number) && season.season_number > 0 && season.air_date && season.air_date <= today)
    .map(season => ({ number: season.season_number, name: season.name || `Staffel ${season.season_number}` }))
  const providers = result['watch/providers']?.results?.DE?.flatrate || []
  const verifiedProvider = providers.filter(service => [8, 337, 9, 119].includes(service.provider_id))
    .map(service => service.provider_name).join(', ')
  const value = { ...mediaSummary(result, type), seasons, verifiedProvider }
  if (detailsCache.size >= 250) detailsCache.delete(detailsCache.keys().next().value)
  detailsCache.set(id, { value, expires: Date.now() + 5 * 60_000 })
  return value
}
function lookupStatus(list, media) {
  const previous = list.entries[mediaKey(list, media)]
  return { ...media, status: previous?.status || '', watchedSeasons: previous?.watchedSeasons || [] }
}
async function lookupTitles(list, query, page) {
  const normalized = query.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
  const result = await tmdb('search/multi', {
    query: normalized === 'starwars' ? 'Star Wars' : query,
    page, language: 'de-DE', include_adult: 'false',
  })
  return {
    results: result.results.filter(entry => ['tv','movie'].includes(entry.media_type) && (entry.title || entry.name))
      .map(entry => lookupStatus(list, mediaSummary(entry, entry.media_type))),
    more: page < Math.min(result.total_pages, 500),
  }
}
function validRating(rating, type) {
  return ratings.includes(rating) && (rating !== 'Lieblingsserie' || type === 'serie') &&
    (rating !== 'Lieblingsfilm' || type === 'film')
}
function storeSelection(list, selected, remember) {
  list.media ||= {}
  for (const { media, watched, rating } of selected) {
    const id = mediaKey(list, media)
    const previous = Object.hasOwn(list.entries, id) ? list.entries[id] : null
    const existingTitle = catalog.get(id) || (Object.hasOwn(list.custom, id) && list.custom[id])
    if (previous?.status === 'excluded') throw fail(409, `„${media.title}“ ist dauerhaft ausgeschlossen.`)
    if ((marvelOrder.includes(id) && !previous && id !== currentMarvel(list.entries)) ||
        (existingTitle && !eligible(existingTitle, list.entries))) {
      throw fail(409, `Bei „${media.title}“ ist zuerst ein früherer Teil an der Reihe.`)
    }
    if (remember && (previous || marvelOrder.includes(id))) throw fail(409, `„${media.title}“ steht bereits in deiner Watchlist.`)
    const published = media.seasons.map(season => season.number)
    const requested = watched || []
    if (!remember && media.type === 'serie' && (!published.length ||
        requested.some(number => !published.includes(number) && !previous?.watchedSeasons?.includes(number)))) {
      throw fail(400, `Bitte wähle veröffentlichte Staffeln für „${media.title}“.`)
    }
    const complete = media.type === 'film' || published.every(number => requested.includes(number))
    if (!remember && !requested.length && !complete && !previous?.watchedSeasons?.length) throw fail(400, 'Bitte wähle mindestens eine Staffel.')
    if (!existingTitle) {
      Object.defineProperty(list.custom, id, {
        value: { ...item(media.title, media.type, media.genres.join(', ')), id, tmdb: media.tmdb }, enumerable: true, writable: true,
      })
    }
    const status = remember ? 'reserve' : complete || previous?.status === 'seen' ? 'seen' : 'watching'
    if (rating && (status !== 'seen' || !validRating(rating, media.type))) throw fail(400, 'Diese Bewertung passt nicht zum Titel oder Sehstatus.')
    const updatedRating = rating || previous?.rating || ''
    list.media[id] = {
      tmdb: media.tmdb, poster: media.poster, description: media.description,
      seasons: media.seasons, verifiedProvider: media.verifiedProvider, year: media.year,
      genres: [...new Set([...(existingTitle?.genres || []), ...media.genres])],
      ...(published.length ? { extent: `${published.length} ${published.length === 1 ? 'Staffel' : 'Staffeln'}` } : {}),
    }
    list.entries[id] = {
      ...previous, status, rating: updatedRating,
      ...(status === 'seen' ? { seenAt: (previous?.rating === updatedRating && previous?.seenAt) || Date.now() } : {}),
      ...(!remember && media.type === 'serie' ? { watchedSeasons: [...new Set(requested)].sort((a, b) => a - b) } : {}),
    }
  }
  return fill(list)
}
async function searchTitles(list, interests) {
  if (!onlineSearch) return []
  const genreIds = [...new Set(interests.flatMap(genre => tmdbGenres[genre] || []))]
  const pages = await Promise.allSettled(['tv', 'movie'].map(async type => {
    const result = await tmdb(`discover/${type}`, {
      language: 'de-DE', include_adult: 'false', sort_by: 'popularity.desc', watch_region: 'DE',
      with_watch_providers: '8|337|9', without_genres: interests.includes('Animation') ? '10751|10762' : '10751|10762|16',
      'vote_count.gte': 30, page: 1 + (list.discoveryPage || 0) % 12,
      ...(genreIds.length ? { with_genres: genreIds.join('|') } : {}),
    })
    const candidates = result.results.filter(result => {
      const title = result.title || result.name
      return title && !catalog.has(slug(title)) && !Object.hasOwn(list.entries, slug(title))
        && !Object.hasOwn(list.custom, slug(title)) && (result.first_air_date || result.release_date || '9999') <= new Date().toISOString().slice(0, 10)
    }).slice(0, 10)
    const details = await Promise.allSettled(candidates.map(async result => {
      const details = await tmdb(`${type}/${result.id}`, {
        language: 'de-DE', append_to_response: 'watch/providers',
      })
      // Film collections need a confirmed viewing order before entering automatic recommendations.
      if (details.belongs_to_collection || /marvel/i.test(details.production_companies?.map(company => company.name).join(' '))) return null
      const title = details.title || details.name
      if (!title) return null
      const matched = interests.filter(genre => tmdbGenres[genre]?.some(id => result.genre_ids.includes(id)))
      const tags = [...new Set([...matched, ...genreTags(details)])]
      const reason = matched.length ? `Passt zu deinen Genre-Interessen ${matched.join(', ')}.` : ''
      const studios = details['watch/providers']?.results?.DE?.flatrate || []
      const providers = studios.filter(service => [8, 337, 9, 119].includes(service.provider_id)).map(service => service.provider_name)
      const extent = type === 'tv' && details.seasons ? details.seasons.filter(season => season.season_number > 0 &&
        season.air_date && season.air_date <= new Date().toISOString().slice(0, 10)).length : 0
      return {
        ...item(title, type === 'tv' ? 'serie' : 'film', tags.join(', '), [reason, details.overview?.slice(0, 200)].filter(Boolean).join(' '),
          extent ? `${extent} ${extent === 1 ? 'Staffel' : 'Staffeln'}` : '', 'discovery'),
        verifiedProvider: providers.length ? providers.join(', ') : '',
        ...mediaArtwork(details),
        tmdb: `${type}:${result.id}`,
      }
    }))
    return details.flatMap(result => result.status === 'fulfilled' && result.value ? [result.value] : [])
  }))
  if (pages.every(page => page.status === 'rejected')) throw Error('TMDB nicht erreichbar')
  return pages.flatMap(page => page.status === 'fulfilled' ? page.value : [])
}
function addDiscoveries(list, suggestions) {
  for (const entry of suggestions) {
    if (Object.hasOwn(list.entries, entry.id) || Object.hasOwn(list.custom, entry.id) || catalog.has(entry.id) ||
        Object.values(list.custom).some(other => other.tmdb === entry.tmdb) ||
        Object.values(list.media || {}).some(other => other.tmdb === entry.tmdb)) continue
    Object.defineProperty(list.custom, entry.id, { value: entry, enumerable: true, writable: true })
  }
}
function mutate(list, input) {
  const { id, action, rating } = input
  const { entries, custom } = list
  if (action === 'preferences') {
    if (!Array.isArray(input.interests) || input.interests.some(genre => !genres.includes(genre))) throw fail(400, 'Ungültige Genres.')
    list.interests = [...new Set(input.interests)]
    for (const [id, record] of Object.entries(entries)) if (record.status === 'open' && record.suggested) delete entries[id]
    return fill(list)
  }
  if (action === 'add' || action === 'log') {
    const title = typeof input.title === 'string' ? input.title.trim() : ''
    if (!title || title.length > 140 || !['film','serie'].includes(input.type) ||
        (input.genre && !genres.includes(input.genre))) throw fail(400, 'Bitte prüfe Titel, Art und Genre.')
    const key = slug(title)
    if (!key) throw fail(400, 'Bitte gib einen gültigen Titel ein.')
    if (Object.hasOwn(entries, key) || marvelOrder.includes(key)) {
      if (action === 'log') return mutate(list, { action: 'seen', id: key, rating })
      throw fail(409, 'Dieser Titel ist bereits erfasst.')
    }
    const known = catalog.get(key) || (Object.hasOwn(custom, key) ? custom[key] : null)
    const type = known?.type || input.type
    if (action === 'log' && rating && !validRating(rating, type)) {
      throw fail(400, 'Diese Bewertung passt nicht zur Titelart.')
    }
    if (!known) {
      const reason = typeof input.reason === 'string' ? input.reason.trim().slice(0, 400) : ''
      const predecessor = typeof input.predecessor === 'string' ? slug(input.predecessor.trim()) : ''
      const previous = Object.hasOwn(entries, predecessor) && (catalog.get(predecessor) || custom[predecessor])
      if (predecessor && (input.type !== 'film' || previous?.type !== 'film' || marvelOrder.includes(predecessor))) {
        throw fail(400, 'Der vorherige Teil muss ein Film sein, der bereits in deiner Liste steht.')
      }
      const entry = item(title, input.type, input.genre, reason)
      if (predecessor) entry.predecessor = predecessor
      Object.defineProperty(custom, key, { value: entry, enumerable: true, writable: true })
    }
    if (action === 'log' && known && !eligible(known, entries)) throw fail(409, 'Ein früherer Teil ist zuerst an der Reihe.')
    const record = action === 'log'
      ? { status: 'seen', rating: rating || '', seenAt: Date.now() }
      : { status: 'reserve', rating: '' }
    Object.defineProperty(entries, key, { value: record, enumerable: true, writable: true })
    return fill(list)
  }
  if (typeof id !== 'string') throw fail(400, 'Titel fehlt.')
  const existing = Object.hasOwn(entries, id) ? entries[id] : null
  const title = catalog.get(id) || (Object.hasOwn(custom, id) ? custom[id] : null)
  const next = currentMarvel(entries)
  if (!title || (!existing && id !== next && title.pool !== 'seasonal')) throw fail(404, 'Titel nicht gefunden.')
  if (title.pool === 'seasonal' && !existing && monthFormatter.format(Date.now()) !== '12') throw fail(404, 'Titel nicht gefunden.')
  if (action === 'rewatch' && list.rewatch[id]?.offeredAt && existing?.status === 'seen') {
    list.rewatch[id].acknowledgedAt = list.rewatch[id].offeredAt
    return []
  }
  if (existing?.status === 'excluded') throw fail(409, 'Dieser Titel ist dauerhaft ausgeschlossen.')
  if (existing?.status === 'seen' && action !== 'seen') throw fail(409, 'Dieser Titel bleibt im Archiv.')
  if (!['watching','seen','excluded','reserve'].includes(action)) throw fail(400, 'Unbekannter Status.')
  if (!eligible(title, entries)) throw fail(409, 'Ein früherer Teil ist zuerst an der Reihe.')
  if (action === 'reserve' && (existing || title.pool !== 'seasonal')) throw fail(409, 'Dieser Titel kann hier nicht vorgemerkt werden.')
  if (action === 'seen' && rating && !validRating(rating, title.type)) throw fail(400, 'Diese Bewertung passt nicht zur Titelart.')
  const updatedRating = action === 'seen' ? rating || existing?.rating || '' : ''
  const previousDate = existing?.rating === updatedRating ? existing?.seenAt : null
  entries[id] = {
    ...existing,
    status: action,
    rating: updatedRating,
    ...(action === 'seen' ? { seenAt: previousDate || Date.now() } : {}),
  }
  return fill(list)
}

createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; img-src 'self' https://image.tmdb.org; frame-ancestors 'none'; form-action 'self'; base-uri 'none'")
  try {
    const url = new URL(req.url, appUrl)
    const path = url.pathname
    if (req.method === 'GET' && path === '/health') return json(res, { ok: true })
    if (req.method === 'GET' && path === '/verify') {
      const secret = url.searchParams.get('token') || ''
      const user = db.prepare('SELECT id FROM users WHERE verify_hash = ? AND verify_expires > ? AND verified = 0').get(hash(secret), Date.now())
      if (user) db.prepare('UPDATE users SET verified = 1, verify_hash = NULL, verify_expires = NULL WHERE id = ?').run(user.id)
      res.writeHead(303, { Location: user ? '/?verified=1' : '/?verified=0', 'Cache-Control': 'no-store' })
      return res.end()
    }
    if (req.method === 'GET' && path === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      return res.end(index)
    }
    if (req.method === 'GET' && versionedAssets.has(path)) {
      const asset = versionedAssets.get(path)
      res.writeHead(200, { 'Content-Type': asset.type, 'Cache-Control': 'public, max-age=31536000, immutable' })
      return res.end(asset.bytes)
    }
    if (req.method === 'GET' && staticFiles.has(path)) {
      const [file, type] = staticFiles.get(path)
      let bytes
      try { bytes = readFileSync(new URL(`./public/${file}`, import.meta.url)) } catch { throw fail(404, 'Datei nicht gefunden.') }
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' })
      return res.end(bytes)
    }
    if (req.method === 'GET' && path === '/api/list') {
      const user = getUser(req)
      if (!user) throw fail(401, 'Bitte melde dich an.')
      const list = JSON.parse(user.list)
      offerFavorites(user, list)
      return json(res, view(list, user))
    }
    if (req.method === 'GET' && path === '/api/household') {
      const user = getUser(req)
      if (!user) throw fail(401, 'Bitte melde dich an.')
      return json(res, householdView(user))
    }
    if (req.method === 'GET' && path.startsWith('/api/media/')) {
      const user = getUser(req)
      if (!user) throw fail(401, 'Bitte melde dich an.')
      if (!onlineSearch) throw fail(503, 'Die TMDB-Titelsuche ist noch nicht eingerichtet.')
      throttle(`media:${user.id}`, 180)
      const list = JSON.parse(user.list)
      try {
        if (path === '/api/media/search') {
          const query = url.searchParams.get('q')?.trim() || ''
          const page = Number(url.searchParams.get('page') || 1)
          if (query.length < 2 || query.length > 120 || !Number.isInteger(page) || page < 1 || page > 500) {
            throw fail(400, 'Bitte gib einen Titel mit 2 bis 120 Zeichen ein.')
          }
          return json(res, await lookupTitles(list, query, page))
        }
        if (path === '/api/media/details') return json(res, lookupStatus(list, await mediaDetails(url.searchParams.get('id'))))
        throw fail(404, 'Nicht gefunden.')
      } catch (error) {
        if (error.status) throw error
        throw fail(502, 'TMDB ist gerade nicht erreichbar.')
      }
    }
    if (req.method !== 'POST' || !path.startsWith('/api/')) throw fail(404, 'Nicht gefunden.')
    if (req.headers.origin && req.headers.origin !== appUrl.origin &&
        (production || req.headers['sec-fetch-site'] !== 'same-origin')) throw fail(403, 'Ungültiger Ursprung.')
    const input = await body(req)
    if (['/api/register','/api/resend','/api/login'].includes(path)) {
      const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
      const password = typeof input.password === 'string' ? input.password : ''
      const authAddress = req.socket.remoteAddress
      throttle(`${path}:ip:${authAddress}`, path === '/api/login' ? 60 : 20)
      if (!validEmail(email)) throw fail(400, 'Bitte gib eine gültige E-Mail-Adresse ein.')
      throttle(`${path}:email:${email}`, path === '/api/login' ? 10 : 3)
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (path === '/api/login') {
        if (password.length > 128) throw fail(401, 'E-Mail oder Passwort stimmt nicht.')
        const passwordValid = matches(password, user?.password || dummyPassword)
        if (!user || !passwordValid) throw fail(401, 'E-Mail oder Passwort stimmt nicht.')
        if (!user.verified) throw fail(403, 'Bitte bestätige zuerst deine E-Mail-Adresse.')
        startSession(res, user.id)
        return json(res, { ok: true })
      }
      if (path === '/api/register' && (password.length < 10 || password.length > 128)) throw fail(400, 'Das Passwort muss 10 bis 128 Zeichen haben.')
      if (!user && path === '/api/register') {
        const list = newList(input.profile === 'watchlist' ? 'watchlist' : 'new')
        fill(list)
        const link = token()
        const result = db.prepare('INSERT INTO users (email, password, verify_hash, verify_expires, list) VALUES (?, ?, ?, ?, ?)')
          .run(email, passwordHash(password), hash(link), Date.now() + day, JSON.stringify(list))
        try { await sendVerification(email, link) } catch (error) {
          db.prepare('DELETE FROM users WHERE id = ? AND verified = 0 AND verify_hash = ?').run(result.lastInsertRowid, hash(link))
          throw error
        }
      } else if (user && !user.verified && path === '/api/resend') {
        const link = token()
        db.prepare('UPDATE users SET verify_hash = ?, verify_expires = ? WHERE id = ?').run(hash(link), Date.now() + day, user.id)
        await sendVerification(email, link)
      }
      return json(res, { message: 'Wenn die Adresse registriert werden kann, erhältst du einen Bestätigungslink per E-Mail.' })
    }
    if (path === '/api/logout') {
      const id = sessionId(req)
      if (id) db.prepare('DELETE FROM sessions WHERE hash = ?').run(hash(id))
      res.setHeader('Set-Cookie', sessionCookie('', 0))
      return json(res, { ok: true })
    }
    if (path === '/api/household') {
      const user = getUser(req)
      if (!user) throw fail(401, 'Bitte melde dich an.')
      const invite = updateHousehold(user, input)
      let notice = ''
      if (invite) {
        const link = new URL('/?household=1', appUrl)
        notice = 'Einladung hinterlegt. Sie ist im Haushalt des eingeladenen Kontos sichtbar.'
        if (smtp) {
          try {
            await smtp.sendMail({ from: process.env.MAIL_FROM, to: invite.email, subject: 'AG Watchlist · Einladung zum Haushalt',
              text: `Du wurdest zum Haushalt „${invite.name}“ eingeladen. Melde dich mit dieser E-Mail-Adresse an oder erstelle ein Konto: ${link}
Die Einladung ist sieben Tage gültig.` })
            notice = 'Einladung per E-Mail verschickt.'
          } catch {
            notice = 'Die Einladung ist im Konto hinterlegt. Der E-Mail-Versand ist fehlgeschlagen.'
          }
        }
      }
      return json(res, { ...householdView(user), notice })
    }
    if (path === '/api/list') {
      let user = getUser(req)
      if (!user) throw fail(401, 'Bitte melde dich an, um die Liste zu bearbeiten.')
      let selected
      const remember = input.action === 'remember-selection'
      if (remember || input.action === 'log-selection') {
        if (!onlineSearch) throw fail(503, 'Die TMDB-Titelsuche ist noch nicht eingerichtet.')
        const { items } = input
        if (!Array.isArray(items) || !items.length || items.length > 40 ||
            items.some(entry => !entry || typeof entry.tmdb !== 'string' || !Array.isArray(entry.watched) ||
              entry.watched.length > 200 || entry.watched.some(number => !Number.isInteger(number) || number < 1))) {
          throw fail(400, 'Wähle zwischen einem und 40 gültigen Titeln.')
        }
        if (new Set(items.map(entry => entry.tmdb)).size !== items.length) throw fail(400, 'Titel dürfen nur einmal ausgewählt werden.')
        throttle(`media-save:${user.id}`, 45)
        try {
          selected = await Promise.all(items.map(async entry => ({ media: await mediaDetails(entry.tmdb), watched: entry.watched, rating: entry.rating })))
        } catch (error) {
          if (error.status) throw error
          throw fail(502, 'Die Titeldaten konnten gerade nicht geladen werden. Bitte versuche es erneut.')
        }
        user = getUser(req)
        if (!user) throw fail(401, 'Bitte melde dich erneut an.')
      }
      const list = JSON.parse(user.list)
      const promoted = selected ? storeSelection(list, selected, remember) : mutate(list, input)
      save(user, list)
      const needsMore = Object.values(list.entries).filter(record => record.status === 'open').length < 15
      const localFallbacks = promoted.map(slug).filter(id => catalog.get(id)?.pool === 'discovery' && list.entries[id]?.suggested)
      let searchWarning = ''
      if (onlineSearch && (input.action === 'preferences' || needsMore || localFallbacks.length)) {
        try {
          const interests = searchInterests(list)
          const suggestions = await searchTitles(list, interests)
          const fresh = getUser(req)
          if (!fresh) return json(res, { ...view(list, user), promoted })
          const current = JSON.parse(fresh.list)
          current.discoveryPage = (current.discoveryPage || 0) + 1
          const interestsMatch = JSON.stringify(searchInterests(current)) === JSON.stringify(interests)
          if (interestsMatch) {
            addDiscoveries(current, suggestions)
            if (suggestions.length) {
              const refreshed = new Set()
              for (const [id, record] of Object.entries(current.entries)) {
                if (record.status === 'open' && record.suggested &&
                    (input.action === 'preferences' || localFallbacks.includes(id))) {
                  delete current.entries[id]
                  refreshed.add(id)
                }
              }
              const retained = promoted.filter(title => !refreshed.has(slug(title)))
              promoted.splice(0, promoted.length, ...retained)
            }
            promoted.push(...fill(current))
          }
          save(fresh, current)
          return json(res, { ...view(current, fresh), promoted })
        } catch (error) {
          searchWarning = 'Die Online-Suche war nicht erreichbar. Deine Änderungen wurden gespeichert.'
          const fresh = getUser(req)
          if (fresh) return json(res, { ...view(JSON.parse(fresh.list), fresh), promoted, searchWarning })
        }
      }
      return json(res, { ...view(list, user), promoted, searchWarning })
    }
    throw fail(404, 'Nicht gefunden.')
  } catch (error) {
    if (!error.status) console.error(error.code || error.name)
    json(res, { error: error.status ? error.message : 'Der Vorgang ist fehlgeschlagen. Bitte versuche es erneut.' }, error.status || 500)
  }
}).listen(port, '0.0.0.0', () => console.info(`AG Watchlist läuft auf Port ${port}`))
const dummyPassword = passwordHash(token())
