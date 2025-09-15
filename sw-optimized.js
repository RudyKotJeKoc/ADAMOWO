/**
 * Radio Adamowo - Optimized Service Worker
 * Enhanced PWA implementation with intelligent caching strategies
 * Consolidated best practices from all versions
 */

const CACHE_VERSION = '3.0.0';
const CACHE_NAME = `radio-adamowo-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `radio-adamowo-dynamic-v${CACHE_VERSION}`;
const API_CACHE = `radio-adamowo-api-v${CACHE_VERSION}`;
const AUDIO_CACHE = `radio-adamowo-audio-v${CACHE_VERSION}`;

// Enhanced Core Assets - Critical for offline functionality
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/app-optimized.js',
    '/app-comprehensive.js', // Fallback compatibility
    '/style.css',
    '/styles.css',
    '/manifest.json',
    '/favicon.ico',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png',
    '/images/icons/apple-touch-icon.png',
    '/images/icons/favicon.svg'
];

// External CDN Resources with version pinning
const CDN_ASSETS = [
    'https://cdn.tailwindcss.com/3.4.0',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
    'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.min.js'
];

// Enhanced Content Type Patterns
const PATTERNS = {
    api: /\/api-.*\.php(\?.*)?$/,
    streaming: /\.(m3u8|ts)(\?.*)?$/i,
    audio: /\.(mp3|wav|ogg|aac|m4a|flac)(\?.*)?$/i,
    images: /\.(png|jpg|jpeg|gif|svg|webp|ico|avif)(\?.*)?$/i,
    fonts: /\.(woff|woff2|ttf|eot|otf)(\?.*)?$/i,
    css: /\.css(\?.*)?$/i,
    js: /\.js(\?.*)?$/i,
    json: /\.json(\?.*)?$/i,
    video: /\.(mp4|webm|ogg)(\?.*)?$/i
};

// Advanced Cache Strategies
const CACHE_STRATEGIES = {
    cacheFirst: 'cacheFirst',
    networkFirst: 'networkFirst', 
    networkOnly: 'networkOnly',
    cacheOnly: 'cacheOnly',
    staleWhileRevalidate: 'staleWhileRevalidate',
    backgroundSync: 'backgroundSync'
};

// Cache Configuration by Content Type
const CACHE_CONFIG = {
    [PATTERNS.api]: {
        strategy: CACHE_STRATEGIES.networkFirst,
        maxAge: 5 * 60 * 1000, // 5 minutes
        maxEntries: 50
    },
    [PATTERNS.streaming]: {
        strategy: CACHE_STRATEGIES.networkOnly, // Live streams shouldn't be cached
        maxAge: 0
    },
    [PATTERNS.audio]: {
        strategy: CACHE_STRATEGIES.cacheFirst,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxEntries: 100
    },
    [PATTERNS.images]: {
        strategy: CACHE_STRATEGIES.cacheFirst,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 200
    },
    [PATTERNS.fonts]: {
        strategy: CACHE_STRATEGIES.cacheFirst,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxEntries: 30
    },
    [PATTERNS.css]: {
        strategy: CACHE_STRATEGIES.staleWhileRevalidate,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        maxEntries: 20
    },
    [PATTERNS.js]: {
        strategy: CACHE_STRATEGIES.staleWhileRevalidate,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        maxEntries: 50
    },
    [PATTERNS.json]: {
        strategy: CACHE_STRATEGIES.staleWhileRevalidate,
        maxAge: 60 * 60 * 1000, // 1 hour
        maxEntries: 20
    }
};

// Performance monitoring
const PERFORMANCE_METRICS = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    lastUpdated: Date.now()
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
    console.log(`Service Worker ${CACHE_VERSION} installing...`);
    
    event.waitUntil(
        Promise.all([
            cacheStaticAssets(),
            cacheCDNAssets(),
            self.skipWaiting()
        ])
    );
});

/**
 * Cache static application assets
 */
async function cacheStaticAssets() {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        await cache.addAll(CORE_ASSETS);
        console.log('Core assets cached successfully');
    } catch (error) {
        console.error('Failed to cache core assets:', error);
        // Cache assets individually to handle failures gracefully
        await cacheAssetsIndividually(cache, CORE_ASSETS);
    }
}

/**
 * Cache CDN assets with fallback handling
 */
async function cacheCDNAssets() {
    const cache = await caches.open(CACHE_NAME);
    await cacheAssetsIndividually(cache, CDN_ASSETS);
}

/**
 * Cache assets individually with error handling
 */
async function cacheAssetsIndividually(cache, assets) {
    const promises = assets.map(async (asset) => {
        try {
            await cache.add(asset);
            console.log(`Cached: ${asset}`);
        } catch (error) {
            console.warn(`Failed to cache ${asset}:`, error.message);
        }
    });
    
    await Promise.allSettled(promises);
}

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
    console.log(`Service Worker ${CACHE_VERSION} activating...`);
    
    event.waitUntil(
        Promise.all([
            cleanupOldCaches(),
            self.clients.claim(),
            initializeBackgroundSync()
        ])
    );
});

/**
 * Cleanup old cache versions
 */
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = [CACHE_NAME, DYNAMIC_CACHE, API_CACHE, AUDIO_CACHE];
    
    const deletionPromises = cacheNames
        .filter(cacheName => !validCaches.includes(cacheName))
        .map(cacheName => {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
        });
    
    await Promise.all(deletionPromises);
    console.log('Cache cleanup completed');
}

/**
 * Initialize background sync for offline actions
 */
function initializeBackgroundSync() {
    if ('sync' in self.registration) {
        console.log('Background sync initialized');
    }
}

/**
 * Main fetch event handler with intelligent routing
 */
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    const url = new URL(event.request.url);
    const requestPath = url.pathname + url.search;
    
    // Route request to appropriate handler
    if (isStaticAsset(requestPath)) {
        event.respondWith(handleStaticAsset(event.request));
    } else if (isAPIRequest(requestPath)) {
        event.respondWith(handleAPIRequest(event.request));
    } else if (isStreamingRequest(requestPath)) {
        event.respondWith(handleStreamingRequest(event.request));
    } else if (isMediaRequest(requestPath)) {
        event.respondWith(handleMediaRequest(event.request));
    } else {
        event.respondWith(handleDynamicRequest(event.request));
    }
});

/**
 * Content type detection helpers
 */
function isStaticAsset(path) {
    return CORE_ASSETS.some(asset => path.includes(asset)) ||
           PATTERNS.css.test(path) ||
           PATTERNS.js.test(path) ||
           PATTERNS.images.test(path) ||
           PATTERNS.fonts.test(path);
}

function isAPIRequest(path) {
    return PATTERNS.api.test(path);
}

function isStreamingRequest(path) {
    return PATTERNS.streaming.test(path);
}

function isMediaRequest(path) {
    return PATTERNS.audio.test(path) || PATTERNS.video.test(path);
}

/**
 * Handle static asset requests (Cache First)
 */
async function handleStaticAsset(request) {
    const startTime = Date.now();
    
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            updateMetrics('cacheHit', startTime);
            return cachedResponse;
        }
        
        // Fetch from network and cache
        const networkResponse = await fetchAndCache(request, CACHE_NAME);
        updateMetrics('networkRequest', startTime);
        return networkResponse;
        
    } catch (error) {
        updateMetrics('failedRequest', startTime);
        console.error('Static asset request failed:', error);
        
        // Return offline fallback if available
        return await getOfflineFallback(request);
    }
}

/**
 * Handle API requests (Network First with short cache)
 */
async function handleAPIRequest(request) {
    const startTime = Date.now();
    
    try {
        // Try network first
        const networkResponse = await fetchAndCache(request, API_CACHE, {
            maxAge: 5 * 60 * 1000 // 5 minutes
        });
        updateMetrics('networkRequest', startTime);
        return networkResponse;
        
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            updateMetrics('cacheHit', startTime);
            return cachedResponse;
        }
        
        updateMetrics('failedRequest', startTime);
        throw error;
    }
}

/**
 * Handle streaming requests (Network Only)
 */
async function handleStreamingRequest(request) {
    const startTime = Date.now();
    
    try {
        const response = await fetch(request);
        updateMetrics('networkRequest', startTime);
        return response;
        
    } catch (error) {
        updateMetrics('failedRequest', startTime);
        console.error('Streaming request failed:', error);
        throw error;
    }
}

/**
 * Handle media requests (Cache First with long expiry)
 */
async function handleMediaRequest(request) {
    const startTime = Date.now();
    
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse && !isExpired(cachedResponse, 7 * 24 * 60 * 60 * 1000)) {
            updateMetrics('cacheHit', startTime);
            return cachedResponse;
        }
        
        const networkResponse = await fetchAndCache(request, AUDIO_CACHE);
        updateMetrics('networkRequest', startTime);
        return networkResponse;
        
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            updateMetrics('cacheHit', startTime);
            return cachedResponse;
        }
        
        updateMetrics('failedRequest', startTime);
        throw error;
    }
}

/**
 * Handle dynamic requests (Stale While Revalidate)
 */
async function handleDynamicRequest(request) {
    const startTime = Date.now();
    const cachedResponse = await caches.match(request);
    
    // Return cached response immediately if available
    if (cachedResponse) {
        updateMetrics('cacheHit', startTime);
        
        // Revalidate in background
        fetchAndCache(request, DYNAMIC_CACHE).catch(console.error);
        
        return cachedResponse;
    }
    
    // No cache, fetch from network
    try {
        const networkResponse = await fetchAndCache(request, DYNAMIC_CACHE);
        updateMetrics('networkRequest', startTime);
        return networkResponse;
        
    } catch (error) {
        updateMetrics('failedRequest', startTime);
        return await getOfflineFallback(request);
    }
}

/**
 * Fetch and cache helper with intelligent caching
 */
async function fetchAndCache(request, cacheName, options = {}) {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response.ok) {
        const cache = await caches.open(cacheName);
        const responseClone = response.clone();
        
        // Add cache metadata
        const headers = new Headers(responseClone.headers);
        headers.set('sw-cached-at', Date.now().toString());
        if (options.maxAge) {
            headers.set('sw-max-age', options.maxAge.toString());
        }
        
        const modifiedResponse = new Response(responseClone.body, {
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers: headers
        });
        
        await cache.put(request, modifiedResponse);
    }
    
    return response;
}

/**
 * Check if cached response is expired
 */
function isExpired(response, maxAge) {
    const cachedAt = response.headers.get('sw-cached-at');
    const cacheMaxAge = response.headers.get('sw-max-age') || maxAge;
    
    if (!cachedAt) return false;
    
    return Date.now() - parseInt(cachedAt) > parseInt(cacheMaxAge);
}

/**
 * Get offline fallback response
 */
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // API requests - return offline message
    if (isAPIRequest(url.pathname)) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'Brak połączenia internetowego',
                offline: true
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    // HTML requests - return cached index page
    if (request.headers.get('Accept')?.includes('text/html')) {
        const cachedIndex = await caches.match('/index.html');
        return cachedIndex || new Response('Offline - Radio Adamowo', {
            status: 503,
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // Other requests - return generic offline response
    return new Response('Offline', { status: 503 });
}

/**
 * Update performance metrics
 */
function updateMetrics(type, startTime) {
    const responseTime = Date.now() - startTime;
    
    switch (type) {
        case 'cacheHit':
            PERFORMANCE_METRICS.cacheHits++;
            break;
        case 'networkRequest':
            PERFORMANCE_METRICS.networkRequests++;
            break;
        case 'failedRequest':
            PERFORMANCE_METRICS.failedRequests++;
            break;
    }
    
    // Update average response time
    const totalRequests = PERFORMANCE_METRICS.cacheHits + PERFORMANCE_METRICS.networkRequests;
    if (totalRequests > 0) {
        PERFORMANCE_METRICS.averageResponseTime = 
            (PERFORMANCE_METRICS.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests;
    }
    
    PERFORMANCE_METRICS.lastUpdated = Date.now();
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-comment-sync') {
        event.waitUntil(syncOfflineComments());
    } else if (event.tag === 'background-analytics-sync') {
        event.waitUntil(syncAnalyticsData());
    }
});

/**
 * Sync offline comments when back online
 */
async function syncOfflineComments() {
    try {
        // Implementation would sync any comments stored while offline
        console.log('Syncing offline comments...');
    } catch (error) {
        console.error('Failed to sync offline comments:', error);
    }
}

/**
 * Sync analytics data
 */
async function syncAnalyticsData() {
    try {
        // Send performance metrics to analytics endpoint
        console.log('Syncing analytics data...', PERFORMANCE_METRICS);
    } catch (error) {
        console.error('Failed to sync analytics:', error);
    }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/favicon.svg',
            tag: 'radio-adamowo-notification',
            renotify: true,
            requireInteraction: data.requireInteraction || false,
            actions: data.actions || []
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
        
    } catch (error) {
        console.error('Push notification error:', error);
    }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                // If app is already open, focus it
                for (const client of clients) {
                    if (client.url.includes(self.location.origin)) {
                        return client.focus();
                    }
                }
                
                // Otherwise open new window
                return self.clients.openWindow('/');
            })
    );
});

/**
 * Periodic cache cleanup
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_CLEANUP') {
        event.waitUntil(performCacheCleanup());
    } else if (event.data && event.data.type === 'GET_METRICS') {
        event.ports[0].postMessage(PERFORMANCE_METRICS);
    }
});

/**
 * Perform cache cleanup based on max entries and age
 */
async function performCacheCleanup() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        // Sort by cache timestamp (newest first)
        const sortedRequests = requests.sort((a, b) => {
            const aTime = parseInt(a.headers?.get('sw-cached-at') || '0');
            const bTime = parseInt(b.headers?.get('sw-cached-at') || '0');
            return bTime - aTime;
        });
        
        // Remove excess entries based on max entries config
        const maxEntries = getMaxEntriesForCache(cacheName);
        if (sortedRequests.length > maxEntries) {
            const toDelete = sortedRequests.slice(maxEntries);
            await Promise.all(toDelete.map(request => cache.delete(request)));
        }
    }
    
    console.log('Cache cleanup completed');
}

/**
 * Get max entries configuration for cache
 */
function getMaxEntriesForCache(cacheName) {
    if (cacheName === AUDIO_CACHE) return 100;
    if (cacheName === API_CACHE) return 50;
    if (cacheName === DYNAMIC_CACHE) return 150;
    return 200; // Default
}

console.log(`Radio Adamowo Service Worker ${CACHE_VERSION} loaded`);