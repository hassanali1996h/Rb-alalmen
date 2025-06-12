
const cacheName = "quran-analysis-v1";
const assets = [
  "/digital-analysis4/",
  "/digital-analysis4/index.html",
  "/digital-analysis4/manifest.json",
  "/digital-analysis4/sw.js",
  "/digital-analysis4/icon-192.png",
  "/digital-analysis4/icon-512.png",
  "/digital-analysis4/cmudict_full.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
