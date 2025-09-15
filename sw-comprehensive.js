/**
 * Radio Adamowo - Enhanced Service Worker
 * Comprehensive PWA implementation with intelligent caching
 */

const CACHE_NAME = 'radio-adamowo-v2.0.0';
const DYNAMIC_CACHE = 'radio-adamowo-dynamic-v2.0.0';
const API_CACHE = 'radio-adamowo-api-v2.0.0';

// Core application files to cache immediately
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/app-comprehensive.js',
    '/style.css',
    '/styles.css',
    '/manifest.json',
    '/favicon.ico',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png'
];

// External CDN resources to cache
const CDN_ASSETS = [
    'https://cdn.tailwindcss.com/3.4.0',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
    'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Regex patterns for different content types
const PATTERNS = {
    api: /\/api-.*\.php(\?.*)?$/,
    streaming: /\.(m3u8|ts)(\?.*)?$/,
    audio: /\.(mp3|wav|ogg|aac|m4a)(\?.*)?$/,
    images: /\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/,
    fonts: /\.(woff|woff2|ttf|eot)(\?.*)?$/,
    css: /\.css(\?.*)?$/,
    js: /\.js(\?.*)?$/
};

// Cache strategies for different content types
const CACHE_STRATEGIES = {
    cacheFirst: 'cacheFirst',
    networkFirst: 'networkFirst',
    networkOnly: 'networkOnly',
    cacheOnly: 'cacheOnly',
    staleWhileRevalidate: 'staleWhileRevalidate'
};

// Cache configuration
const CACHE_CONFIG = {
    [PATTERNS.streaming]: CACHE_STRATEGIES.networkOnly,
    [PATTERNS.api]: CACHE_STRATEGIES.networkFirst,
    [PATTERNS.audio]: CACHE_STRATEGIES.cacheFirst,
    [PATTERNS.images]: CACHE_STRATEGIES.cacheFirst,
    [PATTERNS.fonts]: CACHE_STRATEGIES.cacheFirst,
    [PATTERNS.css]: CACHE_STRATEGIES.staleWhileRevalidate,
    [PATTERNS.js]: CACHE_STRATEGIES.staleWhileRevalidate
};

// Install event - cache core assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then((cache) => {
                console.log('Caching core assets');
                return cache.addAll(CORE_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE).then((cache) => {
                console.log('Pre-caching CDN assets');
                return Promise.allSettled(
                    CDN_ASSETS.map(url => 
                        fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(err => console.warn(`Failed to cache ${url}:`, err))
                    )
                );
            })
        ]).then(() => {
            console.log('Service Worker installed successfully');
            return self.skipWaiting();
        })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => 
                            cacheName.startsWith('radio-adamowo-') && 
                            ![CACHE_NAME, DYNAMIC_CACHE, API_CACHE].includes(cacheName)
                        )
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),
            // Claim all clients
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker activated successfully');
        })
    );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Skip POST requests for now (API endpoints with CSRF)
    if (request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

// Main request handling logic
async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    try {
        // Determine cache strategy based on URL pattern
        const strategy = getCacheStrategy(request.url);
        
        switch (strategy) {
            case CACHE_STRATEGIES.cacheFirst:
                return await cacheFirst(request);
            
            case CACHE_STRATEGIES.networkFirst:
                return await networkFirst(request);
            
            case CACHE_STRATEGIES.networkOnly:
                return await networkOnly(request);
            
            case CACHE_STRATEGIES.cacheOnly:
                return await cacheOnly(request);
            
            case CACHE_STRATEGIES.staleWhileRevalidate:
                return await staleWhileRevalidate(request);
            
            default:
                return await networkFirst(request);
        }
    } catch (error) {
        console.error('Request handling failed:', error);
        return await handleOfflineFallback(request);
    }
}

// Determine cache strategy for a given URL
function getCacheStrategy(url) {
    for (const [pattern, strategy] of Object.entries(CACHE_CONFIG)) {
        if (pattern.test(url)) {
            return strategy;
        }
    }
    
    // Default strategy
    return CACHE_STRATEGIES.networkFirst;
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Optionally update in background for long-lived assets
        if (shouldBackgroundUpdate(request)) {
            updateInBackground(request);
        }
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        await updateCache(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request, {
            timeout: 5000 // 5 second timeout
        });
        
        if (networkResponse.ok) {
            await updateCache(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Network request failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Network-only strategy (for streaming content)
async function networkOnly(request) {
    return await fetch(request);
}

// Cache-only strategy
async function cacheOnly(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    throw new Error('Resource not found in cache');
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Always try to update in background
    const networkResponsePromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            updateCache(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(err => {
        console.warn('Background update failed:', err);
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network response
    return await networkResponsePromise;
}

// Update cache with new response
async function updateCache(request, response) {
    const cacheName = getCacheName(request);
    const cache = await caches.open(cacheName);
    
    // Add cache headers for better management
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('sw-cached-at', new Date().toISOString());
    
    const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
    });
    
    return await cache.put(request, cachedResponse);
}

// Determine appropriate cache name
function getCacheName(request) {
    const url = request.url;
    
    if (PATTERNS.api.test(url)) {
        return API_CACHE;
    }
    
    if (CORE_ASSETS.some(asset => url.endsWith(asset))) {
        return CACHE_NAME;
    }
    
    return DYNAMIC_CACHE;
}

// Check if resource should be updated in background
function shouldBackgroundUpdate(request) {
    const url = new URL(request.url);
    
    // Update static assets less frequently
    if (PATTERNS.images.test(url.pathname) || PATTERNS.fonts.test(url.pathname)) {
        return Math.random() > 0.9; // 10% chance
    }
    
    // Update CSS/JS more frequently
    if (PATTERNS.css.test(url.pathname) || PATTERNS.js.test(url.pathname)) {
        return Math.random() > 0.7; // 30% chance
    }
    
    return false;
}

// Background update without blocking response
async function updateInBackground(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            await updateCache(request, response);
        }
    } catch (error) {
        console.warn('Background update failed:', error);
    }
}

// Handle offline fallbacks
async function handleOfflineFallback(request) {
    const url = new URL(request.url);
    
    // Try to find cached version first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // HTML requests - return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
        
        // Fallback offline response
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Radio Adamowo - Offline</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #1a1a1a; color: #fff; }
                    .offline-container { max-width: 500px; margin: 100px auto; }
                    .logo { font-size: 2em; color: #f59e0b; margin-bottom: 20px; }
                    .message { font-size: 1.2em; margin-bottom: 30px; }
                    .button { background: #f59e0b; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="logo">📻 Radio Adamowo</div>
                    <div class="message">
                        <h1>You're offline</h1>
                        <p>Check your internet connection and try again.</p>
                    </div>
                    <a href="/" class="button" onclick="location.reload();">Retry</a>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
    
    // API requests - return JSON error
    if (PATTERNS.api.test(url.pathname)) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Network unavailable. Please check your connection.',
            offline: true
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Other requests - return generic offline response
    return new Response('Offline', { status: 503 });
}

// Message handling for cache management
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'CACHE_STATUS':
            handleCacheStatusRequest(event);
            break;
            
        case 'CLEAR_CACHE':
            handleClearCacheRequest(event, data);
            break;
            
        case 'UPDATE_CACHE':
            handleUpdateCacheRequest(event, data);
            break;
            
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        default:
            console.warn('Unknown message type:', type);
    }
});

// Handle cache status request
async function handleCacheStatusRequest(event) {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = {
            count: keys.length,
            size: await estimateCacheSize(cache)
        };
    }
    
    event.ports[0].postMessage({
        type: 'CACHE_STATUS_RESPONSE',
        data: status
    });
}

// Handle clear cache request
async function handleClearCacheRequest(event, data) {
    const { cacheNames = [] } = data;
    
    if (cacheNames.length === 0) {
        // Clear all caches
        const allCaches = await caches.keys();
        await Promise.all(allCaches.map(name => caches.delete(name)));
    } else {
        // Clear specific caches
        await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    event.ports[0].postMessage({
        type: 'CLEAR_CACHE_RESPONSE',
        success: true
    });
}

// Handle update cache request
async function handleUpdateCacheRequest(event, data) {
    const { urls = [] } = data;
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const results = await Promise.allSettled(
        urls.map(async url => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    return { url, success: true };
                }
                return { url, success: false, error: 'Response not OK' };
            } catch (error) {
                return { url, success: false, error: error.message };
            }
        })
    );
    
    event.ports[0].postMessage({
        type: 'UPDATE_CACHE_RESPONSE',
        data: results.map(r => r.value)
    });
}

// Estimate cache size (approximate)
async function estimateCacheSize(cache) {
    const keys = await cache.keys();
    let totalSize = 0;
    
    // Sample a few entries to estimate average size
    const sampleSize = Math.min(keys.length, 5);
    for (let i = 0; i < sampleSize; i++) {
        const response = await cache.match(keys[i]);
        if (response) {
            const clone = response.clone();
            const text = await clone.text();
            totalSize += text.length;
        }
    }
    
    // Estimate total based on sample
    const averageSize = totalSize / sampleSize;
    return Math.round(averageSize * keys.length);
}

// Periodic cache cleanup
setInterval(async () => {
    try {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
            if (!cacheName.startsWith('radio-adamowo-')) continue;
            
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            // Remove old entries (older than 7 days for dynamic cache)
            if (cacheName === DYNAMIC_CACHE) {
                const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                
                for (const request of keys) {
                    const response = await cache.match(request);
                    if (response) {
                        const cachedAt = response.headers.get('sw-cached-at');
                        if (cachedAt && new Date(cachedAt) < cutoffDate) {
                            await cache.delete(request);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Cache cleanup failed:', error);
    }
}, 60 * 60 * 1000); // Run every hour

console.log('Radio Adamowo Service Worker v2.0.0 loaded');