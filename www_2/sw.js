const CACHE_NAME = 'radio-adamowo-cache-v4';
const PLAYLIST_URL = 'playlist.json';

// Files to cache - UI assets only, NO streaming content
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/playlist.json',
    // Add other static assets as needed
    // '/images/icons/icon-192x192.png',
    // '/images/icons/icon-512x512.png'
];

// Install Service Worker and cache basic resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache resources during install:', err);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all pages
            return self.clients.claim();
        })
    );
});

// Handle fetch requests
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // NEVER cache streaming content
    if (requestUrl.pathname.endsWith('.m3u8') || 
        requestUrl.pathname.endsWith('.ts') || 
        requestUrl.pathname.includes('/stream') ||
        requestUrl.pathname.endsWith('.php')) {
        // Always go to network for streaming and PHP files
        event.respondWith(fetch(event.request));
        return;
    }

    // Special handling for playlist.json - Stale-While-Revalidate
    if (requestUrl.pathname.endsWith(PLAYLIST_URL)) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        // Update cache in background
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(err => {
                        console.error('Fetch failed for playlist:', err);
                        throw err;
                    });
                    // Return cached version immediately, update in background
                    return response || fetchPromise;
                });
            })
        );
        return;
    }
    
    // Cache First strategy for other resources
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }
                // Otherwise fetch from network
                return fetch(event.request).then(networkResponse => {
                    // Don't cache if not a successful response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Clone the response
                    const responseToCache = networkResponse.clone();

                    // Add to cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                }).catch(() => {
                    // If both cache and network fail, return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});