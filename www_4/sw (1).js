const CACHE_NAME = 'radio-adamowo-cache-v3';
const PLAYLIST_URL = 'playlist.json';
// Zaktualizowana lista plików do buforowania
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.webmanifest',
    // Możesz dodać kluczowe zasoby, jeśli masz je lokalnie
    // np. '/images/logo.png'
];

// Instalacja Service Workera i buforowanie podstawowych zasobów
self.addEventListener('install', event => {
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
});

// Aktywacja Service Workera i czyszczenie starych cache
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Obsługa zapytań sieciowych
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Ignoruj zapytania do skryptów PHP
    if (requestUrl.pathname.endsWith('.php')) {
        return; 
    }

    // Strategia "Stale-While-Revalidate" dla playlisty
    if (requestUrl.pathname.endsWith(PLAYLIST_URL)) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    const fetchPromise = fetch(event.request).then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(err => {
                        console.error('Fetch failed for playlist:', err);
                    });
                    // Zwróć z cache, jeśli jest, w tle zaktualizuj
                    return response || fetchPromise;
                });
            })
        );
        return;
    }
    
    // Strategia "Cache First" dla pozostałych zasobów
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jeśli zasób jest w cache, zwróć go
                if (response) {
                    return response;
                }
                // W przeciwnym razie, pobierz z sieci
                return fetch(event.request).then(networkResponse => {
                    // Opcjonalnie: dodaj do cache nowo pobrane zasoby
                    // if (networkResponse.status === 200) {
                    //     const responseToCache = networkResponse.clone();
                    //     caches.open(CACHE_NAME).then(cache => {
                    //         cache.put(event.request, responseToCache);
                    //     });
                    // }
                    return networkResponse;
                });
            })
    );
});
