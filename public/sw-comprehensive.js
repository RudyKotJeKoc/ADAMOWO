/**
 * Comprehensive Service Worker for Radio Adamowo
 *
 * Features:
 * - Multiple cache strategies per content type
 * - App shell caching
 * - Media caching with size limits
 * - Background sync for offline actions
 * - Push notifications support
 * - Periodic background sync
 * - Cache versioning and cleanup
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSION = '2.0.0';
const CACHE_PREFIX = 'adamowo';

// Cache names
const CACHES = {
  APP_SHELL: `${CACHE_PREFIX}-app-shell-v${VERSION}`,
  STATIC: `${CACHE_PREFIX}-static-v${VERSION}`,
  MEDIA: `${CACHE_PREFIX}-media-v${VERSION}`,
  API: `${CACHE_PREFIX}-api-v${VERSION}`,
  IMAGES: `${CACHE_PREFIX}-images-v${VERSION}`,
};

// Cache limits (in bytes)
const CACHE_LIMITS = {
  MEDIA: 100 * 1024 * 1024, // 100 MB
  IMAGES: 50 * 1024 * 1024, // 50 MB
  API: 5 * 1024 * 1024, // 5 MB
};

// Cache durations (in milliseconds)
const CACHE_DURATION = {
  APP_SHELL: 7 * 24 * 60 * 60 * 1000, // 7 days
  STATIC: 30 * 24 * 60 * 60 * 1000, // 30 days
  MEDIA: 90 * 24 * 60 * 60 * 1000, // 90 days
  API: 5 * 60 * 1000, // 5 minutes
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// App shell - critical files for offline functionality
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/Icon.jpg',
  '/images/favicon.jpg',
];

// Static assets to precache
const STATIC_ASSETS = [
  '/music/playlist.json',
  '/data/media-manifest.json',
];

// ============================================================================
// INSTALL EVENT
// ============================================================================

self.addEventListener('install', (event) => {
  console.log(`[SW ${VERSION}] Installing...`);

  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(CACHES.APP_SHELL).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      }),
      // Cache static assets (non-blocking)
      caches.open(CACHES.STATIC).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn('[SW] Some static assets failed to cache:', error);
        });
      }),
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// ============================================================================
// ACTIVATE EVENT
// ============================================================================

self.addEventListener('activate', (event) => {
  console.log(`[SW ${VERSION}] Activating...`);

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith(CACHE_PREFIX) && !Object.values(CACHES).includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Clean up expired cache entries
      cleanupExpiredCaches(),
      // Take control of all clients
      self.clients.claim(),
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// ============================================================================
// FETCH EVENT - ROUTING BY STRATEGY
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests (except API calls)
  if (url.origin !== self.location.origin && !isApiRequest(url)) {
    return;
  }

  // Route to appropriate strategy
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isAudioRequest(url)) {
    event.respondWith(handleMediaRequest(request, CACHES.MEDIA));
  } else if (isVideoRequest(url)) {
    event.respondWith(handleMediaRequest(request, CACHES.MEDIA));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// ============================================================================
// REQUEST TYPE DETECTION
// ============================================================================

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isAudioRequest(url) {
  return /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url.pathname) || url.pathname.includes('/music/');
}

function isVideoRequest(url) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url.pathname) || url.pathname.includes('/video/');
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname) || url.pathname.includes('/images/');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || url.hostname.includes('supabase');
}

function isStaticAsset(url) {
  return /\.(js|css|json|woff2?|ttf|eot)$/i.test(url.pathname);
}

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

/**
 * App Shell Strategy: Cache First with Network Update
 */
async function handleNavigationRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse && !navigator.onLine) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);

    // Update cache in background
    const cache = await caches.open(CACHES.APP_SHELL);
    cache.put('/index.html', networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // Network failed, return cached version
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache, return offline page
    return new Response('Offline - App not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

/**
 * Media Strategy: Cache First with Background Update
 * For audio and video files
 */
async function handleMediaRequest(request, cacheName) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving media from cache:', request.url);
      return cachedResponse;
    }

    // Fetch from network
    console.log('[SW] Fetching media from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache media file (with size check)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await enforceMediaCacheLimit(cache, CACHE_LIMITS.MEDIA);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Media request failed:', error);

    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response('Media unavailable offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Image Strategy: Cache First with Expiration
 */
async function handleImageRequest(request) {
  try {
    const cached = await caches.match(request);

    // Check if cached and not expired
    if (cached) {
      const cachedDate = cached.headers.get('sw-cached-date');
      if (cachedDate) {
        const age = Date.now() - parseInt(cachedDate, 10);
        if (age < CACHE_DURATION.IMAGES) {
          return cached;
        }
      } else {
        return cached; // No date header, assume valid
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    // Cache with timestamp
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.IMAGES);
      const responseToCache = new Response(networkResponse.clone().body, {
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cached-date': Date.now().toString(),
        },
      });
      await enforceMediaCacheLimit(cache, CACHE_LIMITS.IMAGES);
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    // Return cached if available
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return placeholder or error
    return new Response('Image unavailable', { status: 503 });
  }
}

/**
 * API Strategy: Network First with Cache Fallback
 */
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(CACHES.API);
      const responseToCache = new Response(networkResponse.clone().body, {
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cached-date': Date.now().toString(),
        },
      });
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cached = await caches.match(request);
    if (cached) {
      // Check if cache is still valid
      const cachedDate = cached.headers.get('sw-cached-date');
      if (cachedDate) {
        const age = Date.now() - parseInt(cachedDate, 10);
        if (age < CACHE_DURATION.API) {
          return cached;
        }
      }
    }

    return new Response(JSON.stringify({ error: 'API unavailable offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Static Asset Strategy: Cache First, Update in Background
 */
async function handleStaticAsset(request) {
  const cached = await caches.match(request);

  if (cached) {
    // Return cached, update in background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(CACHES.STATIC).then((cache) => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {
      // Network failed, no problem - we have cache
    });

    return cached;
  }

  // No cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.STATIC);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Static asset unavailable', { status: 503 });
  }
}

/**
 * Default Strategy: Network First with Cache Fallback
 */
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHES.STATIC);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    return new Response('Resource unavailable offline', { status: 503 });
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Enforce cache size limit by removing oldest entries
 */
async function enforceMediaCacheLimit(cache, maxSize) {
  try {
    const keys = await cache.keys();
    let totalSize = 0;
    const entries = [];

    // Calculate total size and collect entries with metadata
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        const size = blob.size;
        const cachedDate = response.headers.get('sw-cached-date') || '0';

        entries.push({
          request: key,
          size,
          cachedDate: parseInt(cachedDate, 10),
        });

        totalSize += size;
      }
    }

    // If over limit, remove oldest entries
    if (totalSize > maxSize) {
      console.log(`[SW] Cache over limit (${totalSize}/${maxSize}), cleaning up...`);

      // Sort by date (oldest first)
      entries.sort((a, b) => a.cachedDate - b.cachedDate);

      // Remove entries until under limit
      for (const entry of entries) {
        if (totalSize <= maxSize * 0.8) break; // Keep 20% buffer

        await cache.delete(entry.request);
        totalSize -= entry.size;
        console.log('[SW] Removed cached entry:', entry.request.url);
      }
    }
  } catch (error) {
    console.error('[SW] Error enforcing cache limit:', error);
  }
}

/**
 * Clean up expired cache entries
 */
async function cleanupExpiredCaches() {
  const cacheEntries = [
    { name: CACHES.API, duration: CACHE_DURATION.API },
    { name: CACHES.IMAGES, duration: CACHE_DURATION.IMAGES },
    { name: CACHES.STATIC, duration: CACHE_DURATION.STATIC },
  ];

  for (const { name, duration } of cacheEntries) {
    try {
      const cache = await caches.open(name);
      const keys = await cache.keys();

      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const cachedDate = response.headers.get('sw-cached-date');
          if (cachedDate) {
            const age = Date.now() - parseInt(cachedDate, 10);
            if (age > duration) {
              await cache.delete(key);
              console.log('[SW] Removed expired cache entry:', key.url);
            }
          }
        }
      }
    } catch (error) {
      console.error(`[SW] Error cleaning cache ${name}:`, error);
    }
  }
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName.startsWith(CACHE_PREFIX)) {
                return caches.delete(cacheName);
              }
            })
          );
        }).then(() => {
          event.ports[0]?.postMessage({ success: true });
        })
      );
      break;

    case 'PRECACHE_TRACKS':
      event.waitUntil(
        precacheTracks(data.tracks).then(() => {
          event.ports[0]?.postMessage({ success: true });
        })
      );
      break;

    default:
      console.warn('[SW] Unknown message type:', type);
  }
});

/**
 * Precache specific tracks for offline use
 */
async function precacheTracks(tracks) {
  if (!Array.isArray(tracks)) return;

  const cache = await caches.open(CACHES.MEDIA);

  for (const track of tracks) {
    try {
      const response = await fetch(track.url);
      if (response.ok) {
        await cache.put(track.url, response);
        console.log('[SW] Precached track:', track.title);
      }
    } catch (error) {
      console.warn('[SW] Failed to precache track:', track.title, error);
    }
  }
}

// ============================================================================
// INDEXEDDB FOR RATINGS
// ============================================================================

const RATINGS_DB_NAME = 'adamowo-ratings';
const RATINGS_DB_VERSION = 1;
const RATINGS_STORE_NAME = 'pending-ratings';

/**
 * Open or create IndexedDB for ratings
 */
function openRatingsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(RATINGS_DB_NAME, RATINGS_DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(RATINGS_STORE_NAME)) {
        const store = db.createObjectStore(RATINGS_STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });

        // Create indexes
        store.createIndex('trackId', 'trackId', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });

        console.log('[SW] Created ratings object store');
      }
    };
  });
}

/**
 * Get all pending (unsynced) ratings from IndexedDB
 */
async function getPendingRatings() {
  try {
    const db = await openRatingsDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([RATINGS_STORE_NAME], 'readonly');
      const store = transaction.objectStore(RATINGS_STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false); // Get all where synced = false

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('[SW] Error getting pending ratings:', error);
    return [];
  }
}

/**
 * Mark rating as synced in IndexedDB
 */
async function markRatingAsSynced(ratingId) {
  try {
    const db = await openRatingsDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([RATINGS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(RATINGS_STORE_NAME);
      const getRequest = store.get(ratingId);

      getRequest.onsuccess = () => {
        const rating = getRequest.result;
        if (rating) {
          rating.synced = true;
          rating.syncedAt = Date.now();
          const updateRequest = store.put(rating);

          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve(false);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('[SW] Error marking rating as synced:', error);
    return false;
  }
}

/**
 * Delete synced ratings older than specified days
 */
async function cleanupSyncedRatings(daysToKeep = 30) {
  try {
    const db = await openRatingsDB();
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([RATINGS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(RATINGS_STORE_NAME);
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));

      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const rating = cursor.value;
          if (rating.syncedAt && rating.syncedAt < cutoffTime) {
            cursor.delete();
            deletedCount++;
          }
          cursor.continue();
        } else {
          console.log(`[SW] Cleaned up ${deletedCount} old synced ratings`);
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('[SW] Error cleaning up synced ratings:', error);
    return 0;
  }
}

// ============================================================================
// BACKGROUND SYNC (if supported)
// ============================================================================

if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'sync-ratings') {
      event.waitUntil(syncRatings());
    }
  });
}

/**
 * Synchronize pending ratings with backend
 * Implements retry logic with exponential backoff
 */
async function syncRatings() {
  console.log('[SW] Starting ratings synchronization...');

  try {
    // Get all pending ratings from IndexedDB
    const pendingRatings = await getPendingRatings();

    if (pendingRatings.length === 0) {
      console.log('[SW] No pending ratings to sync');
      return;
    }

    console.log(`[SW] Found ${pendingRatings.length} pending ratings to sync`);

    // Prepare payload for API
    const payload = {
      ratings: pendingRatings.map((rating) => ({
        trackId: rating.trackId,
        rating: rating.rating,
        timestamp: rating.timestamp,
        userId: rating.userId || null,
        sessionId: rating.sessionId || null,
      })),
    };

    // Attempt to sync with retry logic
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[SW] Sync attempt ${attempt + 1}/${maxRetries + 1}`);

        // Send to API endpoint
        const response = await fetch('/api/v1/ratings/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('[SW] Ratings synced successfully:', result);

        // Mark all ratings as synced
        const syncPromises = pendingRatings.map((rating) =>
          markRatingAsSynced(rating.id)
        );
        await Promise.all(syncPromises);

        console.log('[SW] Marked all ratings as synced');

        // Cleanup old synced ratings
        await cleanupSyncedRatings(30);

        // Success - exit retry loop
        return;

      } catch (error) {
        lastError = error;
        console.error(`[SW] Sync attempt ${attempt + 1} failed:`, error);

        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const backoffDelay = Math.pow(2, attempt + 1) * 1000;
          console.log(`[SW] Retrying in ${backoffDelay}ms...`);

          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        }
      }
    }

    // All retries failed
    throw new Error(`Failed to sync ratings after ${maxRetries + 1} attempts: ${lastError.message}`);

  } catch (error) {
    console.error('[SW] Rating synchronization failed:', error);

    // Re-throw to signal Background Sync API that sync failed
    // This will cause the browser to retry later automatically
    throw error;
  }
}

// ============================================================================
// PERIODIC BACKGROUND SYNC (if supported)
// ============================================================================

if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync triggered:', event.tag);

    if (event.tag === 'update-playlist') {
      event.waitUntil(updatePlaylist());
    }
  });
}

async function updatePlaylist() {
  try {
    const response = await fetch('/music/playlist.json');
    if (response.ok) {
      const cache = await caches.open(CACHES.STATIC);
      await cache.put('/music/playlist.json', response);
      console.log('[SW] Playlist updated');
    }
  } catch (error) {
    console.error('[SW] Failed to update playlist:', error);
  }
}

console.log(`[SW ${VERSION}] Service Worker loaded`);
