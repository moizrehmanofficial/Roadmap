/* DevGuide service worker — makes the site installable and readable offline.
   Pages: network first (always fresh when online), cached copy when offline.
   Build assets (/_next/static, fonts, icons): cache first — their URLs change when content changes. */
const VERSION = "v1"; // bump to clear old caches on deploy (pages are network-first, so content stays fresh anyway)
const PAGES = `dg-pages-${VERSION}`;
const STATIC = `dg-static-${VERSION}`;
const PRECACHE = ["/", "/offline", "/progress", "/playground", "/topics", "/search.json", "/paths.json", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(u)))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("dg-") && ![PAGES, STATIC].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await Promise.race([fetch(request), timeout(4000)]);
    if (response.ok && response.type === "basic") cache.put(stripQuery(request), response.clone());
    return response;
  } catch {
    const cached = (await cache.match(stripQuery(request))) || (await caches.match(stripQuery(request)));
    if (cached) return cached;
    if (request.mode === "navigate") return (await cache.match("/offline")) || Response.error();
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(STATIC)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(PAGES);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((r) => {
      if (r.ok) cache.put(request, r.clone());
      return r;
    })
    .catch(() => cached);
  return cached || network;
}

// Lessons are cached without their query string (e.g. ?source=pwa)
function stripQuery(request) {
  const url = new URL(request.url);
  return url.origin + url.pathname;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // React Server Component payloads for client-side navigation: let Next.js handle them.
  // If they fail offline, Next.js falls back to a full page load, which is served from the cache below.
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || /\.(woff2?|png|svg|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname === "/search.json" || url.pathname === "/paths.json") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (request.mode === "navigate") {
    // The playground with ?code=… should still work offline using the cached shell
    event.respondWith(networkFirst(request));
  }
});
