/* Key tool — запасная копия страницы, чтобы приложение открывалось без связи. */
const CACHE = 'keytool-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add('./'))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.mode !== 'navigate' || new URL(r.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 4000);
    try {
      const res = await fetch(r, { signal: ctl.signal });
      if (res.ok) c.put('./', res.clone());
      return res;
    } catch (err) {
      const hit = await c.match('./');
      if (hit) return hit;
      throw err;
    } finally { clearTimeout(timer); }
  })());
});
