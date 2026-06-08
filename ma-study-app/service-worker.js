/* service-worker.js — precaches the app shell + baked content so the installed
   PWA works fully offline. Library docs and 3D models are cached on first use. */
var CACHE = "ma-study-v1";
var CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "js/store.js",
  "js/app.js",
  "js/modules/util.js",
  "js/modules/flashcards.js",
  "js/modules/quiz.js",
  "js/modules/calendar.js",
  "js/modules/notes.js",
  "js/modules/facts.js",
  "js/modules/viewer3d.js",
  "js/modules/library.js",
  "js/modules/settings.js",
  "content/data.js",
  "content/library.js",
  "content/decks/anatomy.js",
  "content/decks/med-terminology.js",
  "content/decks/pharmacology.js",
  "content/decks/clinical.js",
  "content/decks/teas.js",
  "content/quizzes/quizbank.js",
  "assets/icon.svg",
  "assets/icon-180.png",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/icon-512-maskable.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // add individually so one missing optional file doesn't fail the whole install
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // runtime-cache same-origin GETs (library docs, models, etc.)
        if (res && res.status === 200 && e.request.url.indexOf(self.location.origin) === 0) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        // offline fallback to the app shell for navigations
        if (e.request.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
