/* The Chronicle — service worker. VERSION is stamped in at build time. */
const VERSION = '__VERSION__';
const CACHE = 'chronicle-' + VERSION;

/* Precached on install: the app shell and its immediate dependencies.
   Chapter chunks and the search index are cached on first use (see fetch). */
const CORE = [
  './',
  'index.html',
  'app.webmanifest',
  'manifest-chunks.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(Promise.all([
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
    self.clients.claim(),
  ]));
});

/* The shell posts this when the reader taps "tap to update". */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts) pass through

  // Update probe: always try the network first so a new deploy is noticed.
  if (url.pathname.endsWith('manifest-chunks.json')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Navigations resolve to the cached shell (offline-first single page).
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('index.html').then((r) => r || fetch(req)));
    return;
  }

  // Everything else (chunks, search index, icons): cache-first with a
  // background revalidate. Version lives in the ?v= query, and stale caches
  // are purged wholesale on activate when VERSION changes.
  e.respondWith(caches.match(req).then((cached) => {
    const net = fetch(req).then((resp) => {
      if (resp && resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return resp;
    }).catch(() => cached);
    return cached || net;
  }));
});
