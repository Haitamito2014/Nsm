// NSM service worker: makes the app installable and lets it open without a connection.
// Always tries the network first, so people get updates as soon as they're published;
// falls back to the saved copy when offline.
const CACHE = "nsm-v2";
const SHELL = [
  "./", "index.html", "app.js", "style.css", "characters.js", "characters.css",
  "firebase-config.js", "vendor/qrcode.js", "demo.html", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only this site's own files and the Firebase SDK files; never Firebase data or sign-in traffic.
  const cacheable = url.origin === location.origin || url.href.startsWith("https://www.gstatic.com/firebasejs/");
  if (!cacheable) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
