// Zmiana wersji wymusza instalację nowego SW i usunięcie starych cache'y
// (w tym audio zapisanego przez poprzednie wersje).
const SW_VERSION = 'v5';
const CACHE_NAME = `radio-adamowo-${SW_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/icons/favicon.ico',
  '/assets/images/icons/icon-pwa-master.svg',
  '/assets/images/placeholders/cover-sunset-waves.svg',
  '/assets/images/placeholders/cover-purple-frequency.svg',
  '/assets/images/placeholders/cover-golden-hour.svg',
];

const MEDIA_EXTENSIONS = /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|webm|mp4|m3u8|ts)$/i;

/**
 * Żądania, których SW w ogóle nie dotyka - przeglądarka wysyła je prosto do
 * serwera, razem z nagłówkiem `Range`. Dzięki temu serwer odpowiada 206
 * Partial Content i działa strumieniowanie oraz przewijanie mp3.
 */
const shouldBypass = (request, url) =>
  request.method !== 'GET' ||
  url.origin !== self.location.origin ||
  url.pathname.startsWith('/music/') ||
  MEDIA_EXTENSIONS.test(url.pathname) ||
  request.headers.has('range') ||
  request.destination === 'audio' ||
  request.destination === 'video';

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
  // Force waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      // Take control of all clients immediately
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-only: brak respondWith = SW nie pośredniczy w żądaniu.
  if (shouldBypass(request, url)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache API nie przyjmuje odpowiedzi 206 i nie ma sensu cache'ować błędów.
        if (response.ok && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          event.waitUntil(
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, responseToCache))
              .catch(() => undefined)
          );
        }

        return response;
      })
      .catch(async () => {
        // Network failed, try cache
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }

        // If no cache match, return offline page for navigation requests
        if (request.mode === 'navigate') {
          const shell = await caches.match('/index.html');
          if (shell) {
            return shell;
          }
        }

        return new Response('Offline - content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      })
  );
});

// Message event - for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
