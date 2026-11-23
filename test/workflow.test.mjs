import assert from 'node:assert/strict'
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
    globalThis.fetch = async url => {
      if (url.hostname !== 'api.themoviedb.org' || url.searchParams.get('api_key') !== 'local-fixture') {
        throw new Error('Unexpected request')
      }
      if (url.pathname === '/3/search/multi' && url.searchParams.get('query') === 'Star Wars') return Response.json({
        results: [
          { id: 51, media_type: 'movie', title: 'Star Wars: Testfilm', overview: 'Eine Filmhandlung.', poster_path: '/movie.jpg' },
          { id: 52, media_type: 'tv', name: 'Star Wars: Testserie' },
          { id: 53, media_type: 'person', name: 'Auszuschließender Treffer' },
        ],
        total_pages: 2,
      })
      if (url.pathname === '/3/movie/51') return Response.json({
        id: 51, title: 'Star Wars: Testfilm', overview: 'Eine Filmhandlung.', poster_path: '/movie.jpg',
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
      SMTP_URL: '', TMDB_API_KEY: 'local-fixture', TMDB_READ_TOKEN: '' },
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

  const demo = await read()
  assert.equal(demo.titles.length, 15)
  assert.equal(demo.marvel.id, 'the-first-avenger-captain-america')
  assert.equal((await post('list', { action: 'seen', id: demo.marvel.id })).status, 401)
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
  assert.equal((await post('list', { action: 'seen', id: demo.marvel.id, rating: 'Gut' }, first)).status, 200)
  assert.equal((await read(first)).marvel.id, 'captain-marvel')
  assert.equal((await read(second)).marvel.id, demo.marvel.id)

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
  assert.equal(recorded.find(title => title.tmdb === 'tv:52').status, 'watching')
  assert.deepEqual((await series()).watchedSeasons, [2])
  assert.equal((await logSelection([{ tmdb: 'tv:52', watched: [1, 2, 3] }])).status, 400)
  assert.deepEqual((await series()).watchedSeasons, [2])
  const complete = await logSelection([{ tmdb: 'tv:52', watched: [2, 1] }])
  assert.equal(complete.status, 200)
  const finished = (await complete.json()).titles.find(title => title.tmdb === 'tv:52')
  assert.equal(finished.status, 'seen')
  assert.equal((await post('list', { action: 'seen', id: finished.id, rating: 'Lieblingsserie' }, second)).status, 200)
  assert.deepEqual((await series()).watchedSeasons, [1, 2])
  assert.equal((await read(first)).titles.some(title => title.tmdb === 'movie:51'), false)
})
