const cacheName = 'ag-watchlist-offline-v1'
const offlinePage = '/offline.html'

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll([offlinePage, '/offline.css'].map(path => new Request(path, { cache: 'reload' })))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter(name => name.startsWith('ag-watchlist-offline-') && name !== cacheName)
      .map(name => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname === '/offline.css') {
    event.respondWith(caches.match('/offline.css', { cacheName }).then(style => style || fetch(event.request)))
    return
  }
  if (event.request.mode !== 'navigate' || url.pathname !== '/') return
  event.respondWith(fetch(event.request).catch(async () => {
    const page = await caches.match(offlinePage, { cacheName })
    return page || Response.error()
  }))
})
