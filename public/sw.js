const STATIC_CACHE_NAME = 'static-cache-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/globals.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Playfair+Display:wght@400;700&display=swap',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => {
        console.error('Failed to cache static assets:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // For navigation requests (e.g., refreshing a page or navigating to a new one)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // If the network request fails, return the offline page from the cache.
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    // For other requests (CSS, JS, images, etc.)
    event.respondWith(
        caches.match(event.request)
            .then(cacheRes => {
                // Return from cache if found
                return cacheRes || fetch(event.request).then(fetchRes => {
                    // Otherwise, fetch from network, cache it, and then return it.
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        // Don't cache chrome-extension requests
                        if (!event.request.url.startsWith('chrome-extension://')) {
                            cache.put(event.request.url, fetchRes.clone());
                        }
                        return fetchRes;
                    });
                });
            })
            .catch(() => {
                // If everything fails (e.g., an image not in cache and offline)
                // you could return a placeholder image, but for now, we'll just let it fail.
            })
    );
});
