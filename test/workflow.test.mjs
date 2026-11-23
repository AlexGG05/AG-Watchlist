import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { test } from 'node:test'

test('separate verified accounts retain their watchlists and recommendation rules', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'ag-watchlist-'))
  const socket = createServer()
  socket.listen(0, '127.0.0.1')
  await once(socket, 'listening')
  const port = socket.address().port
  await new Promise(resolve => socket.close(resolve))
  const origin = `http://127.0.0.1:${port}`
  const fixture = join(dir, 'tmdb.mjs')
  await writeFile(fixture, `
    globalThis.fetch = async (value, options) => {
      const url = new URL(value)
      if (url.hostname === 'streaming-availability.p.rapidapi.com' && url.pathname === '/shows/tt1234567') {
        if (options.headers['X-RapidAPI-Key'] !== 'fixture-pricing') throw new Error('Unexpected pricing request')
        return Response.json({ streamingOptions: { de: [
          { type: 'rent', service: { id: 'prime' }, price: { currency: 'EUR', amount: '3.99' }, quality: 'hd', link: 'https://www.amazon.de/test' },
        ] } })
      }
      if (url.hostname !== 'api.themoviedb.org' || url.searchParams.get('api_key') !== 'local-fixture') {
        throw new Error('Unexpected request')
      }
      if (url.pathname === '/3/collection/10') return Response.json({ parts: [
        { id: 51, title: 'Star Wars: Testfilm', release_date: '2020-01-01' },
      ] })
      if (url.pathname === '/3/search/multi' && url.searchParams.get('query') === 'Star Wars') return Response.json({
        results: [
          { id: 51, media_type: 'movie', title: 'Star Wars: Testfilm', overview: 'Eine Filmhandlung.', poster_path: '/movie.jpg', genre_ids: [878, 12] },
          { id: 52, media_type: 'tv', name: 'Star Wars: Testserie' },
          { id: 53, media_type: 'person', name: 'Auszuschließender Treffer' },
        ],
        total_pages: 2,
      })
      if (url.pathname === '/3/movie/51') return Response.json({
        id: 51, title: 'Star Wars: Testfilm', overview: 'Eine Filmhandlung.', poster_path: '/movie.jpg',
        genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Abenteuer' }], imdb_id: 'tt1234567',
        'watch/providers': { results: { DE: {
          link: 'https://www.themoviedb.org/movie/51/watch?locale=DE',
          flatrate: [
            { provider_id: 119, provider_name: 'Amazon Prime Video' },
            { provider_id: 999, provider_name: 'MGM Amazon Channel' },
            { provider_id: 337, provider_name: 'Disney Plus' },
          ],
          rent: [{ provider_id: 10, provider_name: 'Amazon Video' }],
          buy: [{ provider_id: 10, provider_name: 'Amazon Video' }],
        } } },
      })
      if (url.pathname === '/3/tv/52') return Response.json({
        id: 52, name: 'Star Wars: Testserie', overview: 'Eine Serienhandlung.', poster_path: '/series.jpg',
        seasons: [
          { season_number: 0, air_date: '2020-01-01' },
          { season_number: 1, air_date: '2021-01-01' },
          { season_number: 2, air_date: '2022-01-01' },
          { season_number: 3, air_date: '2999-01-01' },
        ],
      })
      if (url.pathname === '/3/discover/movie') return Response.json({ results: [
        { id: 42, title: 'Ein neues TMDB-Rätsel', genre_ids: [9648], release_date: '2020-01-01' },
      ] })
      if (url.pathname === '/3/discover/tv') return Response.json({ results: [] })
      if (url.pathname === '/3/movie/42') return Response.json({
        title: 'Ein neues TMDB-Rätsel', genres: [{ name: 'Mystery' }],
        'watch/providers': { results: { DE: { flatrate: [{ provider_id: 8, provider_name: 'Netflix' }] } } },
      })
      throw new Error('Unknown TMDB endpoint')
    }
  `)
  const server = spawn(process.execPath, ['--import', fixture, 'server.mjs'], {
    env: { ...process.env, NODE_ENV: 'test', PORT: port, DATA_DIR: dir, APP_URL: origin,
      SMTP_URL: '', TMDB_API_KEY: 'local-fixture', TMDB_READ_TOKEN: '', STREAMING_AVAILABILITY_API_KEY: 'fixture-pricing' },
  })
  t.after(async () => {
    if (server.exitCode === null) {
      server.kill()
      await once(server, 'exit')
    }
    await rm(dir, { recursive: true, force: true })
  })
  let output = ''
  server.stdout.on('data', chunk => { output += chunk })
  async function waitFor(read) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const value = read()
      if (value) return value
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    assert.fail('Server did not complete the requested operation')
  }
  await waitFor(() => output.includes('läuft auf Port'))
  const post = (path, data, cookie = '') => fetch(`${origin}/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(data),
  })
  const read = async (cookie = '') => (await fetch(`${origin}/api/list`, { headers: { Cookie: cookie } })).json()
  async function register(name, profile) {
    const email = `${name}@example.test`
    const password = 'local-test-password'
    assert.equal((await post('register', { email, password, profile })).status, 200)
    assert.equal((await post('login', { email, password })).status, 403)
    const link = await waitFor(() => output.split('\n').find(line => line.includes(`für ${email}:`))?.split(': ').at(-1))
    assert.equal((await fetch(link, { redirect: 'manual' })).headers.get('location'), '/?verified=1')
    assert.equal((await fetch(link, { redirect: 'manual' })).headers.get('location'), '/?verified=0')
    const loggedIn = await post('login', { email, password })
    assert.equal(loggedIn.status, 200)
    return loggedIn.headers.get('set-cookie').split(';')[0]
  }

  const home = await fetch(origin)
  assert.equal(home.headers.get('cache-control'), 'no-store')
  const html = await home.text()
  for (const name of ['app.js', 'style.css']) {
    const path = [...html.matchAll(/"(\/assets\/([a-f0-9]{16})\/[^"]+)"/g)].find(match => match[1].endsWith('/' + name))
    assert.ok(path, `Expected a versioned URL for ${name}`)
    const asset = await fetch(origin + path[1])
    assert.equal(asset.status, 200)
    assert.match(asset.headers.get('cache-control'), /immutable/)
    const digest = createHash('sha256').update(Buffer.from(await asset.arrayBuffer())).digest('hex')
    assert.ok(digest.startsWith(path[2]), `Versioned URL must match ${name} contents`)
  }

  assert.match(html, /rel="apple-touch-icon"/)
  const manifestResponse = await fetch(origin + '/manifest.webmanifest')
  assert.match(manifestResponse.headers.get('content-type'), /application\/manifest\+json/)
  const manifest = await manifestResponse.json()
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '/')
  for (const icon of manifest.icons) {
    const png = Buffer.from(await (await fetch(origin + icon.src)).arrayBuffer())
    const [width, height] = icon.sizes.split('x').map(Number)
    assert.equal(png.readUInt32BE(16), width)
    assert.equal(png.readUInt32BE(20), height)
  }
  assert.equal((await fetch(origin + '/sw.js')).status, 200)
  assert.equal((await fetch(origin + '/offline.html')).status, 200)

  const firstMarvel = 'the-first-avenger-captain-america'
  assert.equal((await fetch(`${origin}/api/list`)).status, 401)
  assert.equal((await fetch(`${origin}/api/household`)).status, 401)
  assert.equal((await post('list', { action: 'seen', id: firstMarvel })).status, 401)
  const first = await register('imported', 'watchlist')
  const second = await register('independent', 'new')
  const list = await read(first)
  assert.equal(list.titles.find(title => title.id === 'pretty-little-liars').rating, 'Lieblingsserie')
  assert.equal((await read(second)).titles.some(title => title.status === 'seen'), false)
  assert.equal((await post('list', { action: 'seen', id: 'wandavision' }, first)).status, 404)
  assert.equal((await post('list', { action: 'seen', id: 'riverdale' }, first)).status, 409)

  const move = await post('list', { action: 'watching', id: 'eine-geistergeschichte-in-venedig' }, first)
  assert.equal(move.status, 200)
  const after = await move.json()
  assert.equal(after.titles.filter(title => title.status === 'open').length, 15)
  assert.ok(after.titles.some(title => title.status === 'open' && title.type === 'film'))
  assert.ok(after.promoted.length)
  const archive = await post('list', { action: 'seen', id: 'eine-geistergeschichte-in-venedig', rating: 'Lieblingsfilm' }, first)
  assert.equal(archive.status, 200)
  assert.equal((await post('list', { action: 'seen', id: 'eine-geistergeschichte-in-venedig', rating: 'Lieblingsserie' }, first)).status, 400)
  assert.equal((await post('list', { action: 'seen', id: firstMarvel, rating: 'Gut' }, first)).status, 200)
  assert.equal((await read(first)).marvel.id, 'captain-marvel')
  assert.equal((await read(second)).marvel.id, firstMarvel)

  const logged = await post('list', { action: 'log', title: 'Ein eigener Film', type: 'film', genre: 'Musik', rating: 'Gut' }, second)
  assert.equal(logged.status, 200)
  const preferences = await post('list', { action: 'preferences', interests: ['Mystery', 'Sci-Fi'] }, second)
  assert.equal(preferences.status, 200)
  const personalized = await preferences.json()
  assert.deepEqual(personalized.interests, ['Mystery', 'Sci-Fi'])
  assert.equal(personalized.titles.find(title => title.id === 'ein-eigener-film').rating, 'Gut')
  assert.equal(personalized.titles.filter(title => title.status === 'open').length, 15)
  const discovery = personalized.titles.find(title => title.tmdb === 'movie:42')
  assert.equal(discovery.status, 'open')
  assert.equal(discovery.verifiedProvider, 'Netflix')
  assert.equal((await read(first)).titles.some(title => title.id === 'ein-eigener-film'), false)

  const media = (path, cookie) => fetch(`${origin}/api/media/${path}`, { headers: { Cookie: cookie } })
  assert.equal((await media('search?q=Star+Wars', '')).status, 401)
  const search = await (await media('search?q=starw+ars', second)).json()
  assert.deepEqual(search.results.map(result => result.tmdb), ['movie:51', 'tv:52'])
  assert.equal(search.more, true)
  assert.deepEqual(search.results[0].genres, ['Sci-Fi', 'Abenteuer'])
  const remembered = await post('list', { action: 'remember-selection', items: [{ tmdb: 'movie:51', watched: [] }] }, first)
  assert.equal(remembered.status, 200)
  const rememberedFilm = (await remembered.json()).titles.find(title => title.tmdb === 'movie:51')
  assert.equal(rememberedFilm.status, 'reserve')
  assert.equal(rememberedFilm.type, 'film')
  assert.deepEqual(rememberedFilm.genres, ['Sci-Fi', 'Abenteuer'])
  assert.equal(rememberedFilm.poster, '/movie.jpg')
  const streaming = (await (await media('details?id=movie%3A51', second)).json()).offers
  assert.ok(streaming.some(offer => offer.service === 'Amazon Prime Video' && offer.type === 'subscription'))
  assert.ok(streaming.some(offer => offer.channel === 'MGM' && offer.type === 'addon'))
  assert.ok(streaming.some(offer => offer.service === 'Disney+' && offer.type === 'subscription'))
  assert.match(streaming.find(offer => offer.type === 'rent').price, /^3,99\s€$/)
  assert.equal(streaming.find(offer => offer.type === 'buy').price, undefined)
  const series = async () => (await media('details?id=tv%3A52', second)).json()
  assert.deepEqual((await series()).seasons.map(season => season.number), [1, 2])

  const logSelection = items => post('list', { action: 'log-selection', items }, second)
  const bulk = await logSelection([{ tmdb: 'movie:51', watched: [] }, { tmdb: 'tv:52', watched: [2] }])
  assert.equal(bulk.status, 200)
  const recorded = (await bulk.json()).titles
  const film = recorded.find(title => title.tmdb === 'movie:51')
  assert.equal(film.poster, '/movie.jpg')
  assert.equal(film.description, 'Eine Filmhandlung.')
  assert.equal(film.status, 'seen')
  assert.deepEqual(film.genres, ['Sci-Fi', 'Abenteuer'])
  assert.equal(recorded.find(title => title.tmdb === 'tv:52').status, 'watching')
  assert.deepEqual((await series()).watchedSeasons, [2])
  assert.equal((await logSelection([{ tmdb: 'tv:52', watched: [1, 2, 3] }])).status, 400)
  assert.deepEqual((await series()).watchedSeasons, [2])
  const complete = await logSelection([{ tmdb: 'tv:52', watched: [2, 1], rating: 'Sehr gut' }])
  assert.equal(complete.status, 200)
  const finished = (await complete.json()).titles.find(title => title.tmdb === 'tv:52')
  assert.equal(finished.status, 'seen')
  assert.equal(finished.rating, 'Sehr gut')
  assert.equal((await post('list', { action: 'seen', id: finished.id, rating: 'Lieblingsserie' }, second)).status, 200)
  assert.deepEqual((await series()).watchedSeasons, [1, 2])
  assert.equal((await read(first)).titles.find(title => title.tmdb === 'movie:51').status, 'reserve')
  const third = await register('outsider', 'new')
  const household = async cookie => (await fetch(`${origin}/api/household`, { headers: { Cookie: cookie } })).json()
  assert.equal((await post('household', { action: 'invite', email: 'independent@example.test' }, first)).status, 409)
  assert.equal((await post('household', { action: 'create', name: 'Filmabend' }, first)).status, 200)
  assert.equal((await post('household', { action: 'invite', email: 'INDEPENDENT@example.test' }, first)).status, 200)
  const pending = (await household(second)).invitations
  assert.equal(pending.length, 1)
  assert.equal(pending[0].name, 'Filmabend')
  assert.deepEqual((await household(third)).invitations, [])
  assert.equal((await post('household', { action: 'accept', id: pending[0].id }, third)).status, 404)
  assert.equal((await post('household', { action: 'accept', id: pending[0].id }, second)).status, 200)
  assert.equal((await post('household', { action: 'accept', id: pending[0].id }, second)).status, 404)

  for (const account of [first, second]) {
    assert.equal((await post('list', { action: 'add', title: 'Unser Rätsel', type: 'film', genre: 'Mystery' }, account)).status, 200)
  }
  const shared = await household(first)
  assert.deepEqual(shared, await household(second))
  assert.deepEqual(shared.household.members, ['imported@example.test', 'independent@example.test'])
  assert.ok(shared.recommendations.some(title => title.title === 'Unser Rätsel'))
  assert.equal(shared.recommendations.some(title => title.tmdb === 'movie:51'), false)
  assert.equal(shared.recommendations.some(title => title.title === 'Ein eigener Film'), false)
  assert.equal(shared.recommendations.some(title => title.rating !== undefined || title.status !== undefined), false)
  assert.equal((await read(first)).titles.some(title => title.title === 'Ein eigener Film'), false)
  assert.equal((await post('household', { action: 'leave' }, second)).status, 200)
  assert.deepEqual((await household(first)).recommendations, [])
  assert.deepEqual((await household(second)).recommendations, [])
  assert.equal((await read(second)).titles.some(title => title.title === 'Ein eigener Film'), true)

  const logRated = (title, genre, rating) => post('list', { action: 'log', title, type: 'film', genre, rating }, third)
  assert.equal((await logRated('Favorit im All', 'Sci-Fi', 'Lieblingsfilm')).status, 200)
  assert.equal((await logRated('Flacher Western', 'Western', 'Schlecht')).status, 200)
  for (const [title, genre] of [['Neuer Western', 'Western'], ['Neues Weltall', 'Sci-Fi']]) {
    assert.equal((await post('list', { action: 'add', title, type: 'serie', genre }, third)).status, 200)
  }
  const openSeries = (await read(third)).titles.find(title => title.status === 'open' && title.type === 'serie')
  const replenished = await post('list', { action: 'seen', id: openSeries.id }, third)
  assert.equal(replenished.status, 200)
  assert.deepEqual((await replenished.json()).promoted, ['Neues Weltall'])

  const reserveMovie = (await read(first)).titles.find(title => title.tmdb === 'movie:51')
  const remove = (account, id) => post('list', { action: 'remove', id }, account)
  const removedReserve = await remove(first, reserveMovie.id)
  assert.equal(removedReserve.status, 200)
  assert.ok(!(await removedReserve.json()).titles.some(title => title.id === reserveMovie.id))
  const readded = await post('list', { action: 'remember-selection', items: [{ tmdb: 'movie:51', watched: [] }] }, first)
  assert.equal(readded.status, 200)
  assert.equal((await readded.json()).titles.find(title => title.id === reserveMovie.id).status, 'reserve')
  assert.equal((await remove(second, reserveMovie.id)).status, 409)

  const partial = await post('list', { action: 'log-selection', items: [{ tmdb: 'tv:52', watched: [2] }] }, third)
  assert.equal(partial.status, 200)
  const partialSeries = (await partial.json()).titles.find(title => title.tmdb === 'tv:52')
  assert.equal((await remove(third, partialSeries.id)).status, 200)
  assert.ok(!(await read(third)).titles.some(title => title.id === partialSeries.id))
  const resume = await post('list', { action: 'remember-selection', items: [{ tmdb: 'tv:52', watched: [] }] }, third)
  assert.equal(resume.status, 200)
  assert.deepEqual((await resume.json()).titles.find(title => title.id === partialSeries.id).watchedSeasons, [2])

  assert.equal((await post('list', { action: 'watching', id: firstMarvel }, third)).status, 200)
  assert.equal((await remove(third, firstMarvel)).status, 200)
  const marvelAfterRemove = (await read(third)).marvel
  assert.equal(marvelAfterRemove.id, firstMarvel)
  assert.equal(marvelAfterRemove.status, 'open')

  const original = await read(first)
  const originalOpen = new Set(original.titles.filter(title => title.status === 'open').map(title => title.id))
  const refreshed = await post('list', { action: 'refresh-recommendations' }, first)
  assert.equal(refreshed.status, 200)
  const nextList = await refreshed.json()
  const nextOpen = nextList.titles.filter(title => title.status === 'open')
  assert.equal(nextOpen.length, 15)
  assert.ok(nextOpen.some(title => title.type === 'film'))
  assert.ok(nextOpen.some(title => !originalOpen.has(title.id)))
  assert.equal(nextList.marvel.id, original.marvel.id)
  assert.deepEqual(nextList.titles.filter(title => ['seen','excluded','reserve','watching'].includes(title.status)),
    original.titles.filter(title => ['seen','excluded','reserve','watching'].includes(title.status)))
  const nextRefresh = await post('list', { action: 'refresh-recommendations' }, first)
  assert.equal(nextRefresh.status, 200)
  assert.notDeepEqual((await nextRefresh.json()).titles.filter(title => title.status === 'open').map(title => title.id),
    nextOpen.map(title => title.id))

  const universe = async name => (await fetch(`${origin}/api/universe?name=${name}`, { headers: { Cookie: third } })).json()
  const mcu = await universe('marvel')
  assert.ok(mcu.results.length > 40)
  assert.equal(mcu.results.find(title => title.next).id, firstMarvel)
  const laterMarvel = mcu.results.find(title => title.id === 'wandavision')
  const universeTitle = (id, status) => post('list', { action: 'universe-title', id, status }, third)
  assert.equal((await universeTitle(laterMarvel.id, 'reserve')).status, 200)
  assert.equal((await read(third)).titles.find(title => title.id === laterMarvel.id).status, 'reserve')
  assert.equal((await universeTitle(laterMarvel.id, 'seen')).status, 200)
  assert.equal((await universe('marvel')).results.find(title => title.id === laterMarvel.id).status, 'seen')
  assert.equal((await read(third)).marvel.id, firstMarvel)
  const starWars = await universe('star-wars')
  assert.ok(starWars.results.some(title => title.title === 'Andor' && title.type === 'serie'))
  assert.ok(starWars.results.some(title => title.title === 'Krieg der Sterne' && title.type === 'film'))
  const collection = await (await media('collection?id=10', third)).json()
  assert.equal(collection.results[0].tmdb, 'movie:51')
  assert.equal((await post('list', { action: 'log-selection', universe: true,
    items: [{ tmdb: 'tv:52', watched: [], completeSeries: true }] }, third)).status, 200)
  assert.deepEqual((await read(third)).titles.find(title => title.tmdb === 'tv:52').watchedSeasons, [1, 2])

  const regular = (await read(first)).titles.find(title => title.status === 'open')
  const bookmarked = await post('list', { action: 'reserve', id: regular.id }, first)
  assert.equal(bookmarked.status, 200)
  const bookmarkList = (await bookmarked.json()).titles
  assert.equal(bookmarkList.find(title => title.id === regular.id).status, 'reserve')
  assert.equal(bookmarkList.filter(title => title.status === 'open').length, 15)

})
