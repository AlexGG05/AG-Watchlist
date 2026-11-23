import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
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
  const server = spawn(process.execPath, ['server.mjs'], {
    env: { ...process.env, NODE_ENV: 'test', PORT: port, DATA_DIR: dir, APP_URL: origin,
      SMTP_URL: '', TMDB_API_KEY: '', TMDB_READ_TOKEN: '' },
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
  assert.equal((await read(first)).titles.some(title => title.id === 'ein-eigener-film'), false)
})
