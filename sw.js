// Service Worker for GYM Tracker PWA
// Cache version - increment to force update
const CACHE_NAME = 'gym-tracker-v19';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/config.js',
    '/js/auth.js',
    '/js/cloud-sync.js',
    '/js/app.js',
    '/js/muscle-map.js',
    '/js/stats.js',
    '/js/party-mode.js',
    '/js/profile-manager.js',
    '/manifest.json',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    // Installing service worker
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Caching static assets
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.error('[SW] Failed to cache:', err))
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    // Activating service worker
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            // Deleting old cache
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Firebase and other API requests (let them go to network)
    if (url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis.com') && url.pathname.includes('/v1/')) {
        return;
    }

    // For navigation requests, use network-first strategy
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the new version
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // For static assets, use cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Update cache in background (stale-while-revalidate)
                    fetch(request)
                        .then((networkResponse) => {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        })
                        .catch(() => { });
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        // Cache successful responses for static assets
                        if (response.ok &&
                            (url.origin === location.origin ||
                                url.hostname.includes('fonts.googleapis.com') ||
                                url.hostname.includes('fonts.gstatic.com'))) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML requests
                        if (request.headers.get('Accept')?.includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-workout-data') {
        // Background sync triggered
        // The app handles sync when back online
    }
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png'
        });
    }
});
