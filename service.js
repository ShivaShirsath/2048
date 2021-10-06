const cacheName = "colorchache";
const staticAssets = [
  ".",
  "index.html",
  "style/main.css",
  "package.json",
  "js/animframe_polyfill.js",
  "js/application.js",
  "js/bind_polyfill.js",
  "js/classlist_polyfill.js",
  "js/game_manager.js",
  "js/grid.js",
  "js/html_actuator.js",
  "js/keyboard_input_manager.js",
  "js/local_storage_manager.js",
  "js/tile.js",
  "index.js",
  "service.js",
];

self.addEventListener("install", async (e) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
