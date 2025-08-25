
// Import the Firebase app and messaging libraries
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
  authDomain: "bazaarika-lite.firebaseapp.com",
  projectId: "bazaarika-lite",
  storageBucket: "bazaarika-lite.firebasestorage.app",
  messagingSenderId: "497294677028",
  appId: "1:497294677028:web:d6500602307f6d462c74b1",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- Background Notification Handling ---
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon-192x192.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// --- Professional Caching Strategy ---

const STATIC_CACHE_NAME = 'bazaarika-static-v1';
const DYNAMIC_CACHE_NAME = 'bazaarika-dynamic-v1';
const IMAGE_CACHE_NAME = 'bazaarika-images-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on installation
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/manifest.json',
  // Note: CSS and JS files are often hashed, so we'll cache them dynamically
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME && key !== IMAGE_CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Stale-While-Revalidate for CSS, JS, and Fonts
  if (/\.(css|js)$/.test(url.pathname) || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // Strategy 2: Cache First, then Network for Images
  if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(url.pathname)) {
      event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME));
      return;
  }

  // Strategy 3: Network First, then Cache for Navigation/HTML requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
            // Optional: Cache successful navigation responses if needed
            // const copy = response.clone();
            // caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.put(request, copy));
            return response;
        })
        .catch(() => {
            console.log('[SW] Navigation failed. Serving offline page.');
            return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Fallback: Default to network
  event.respondWith(fetch(request));
});

// --- Caching Helper Functions ---

// Stale-While-Revalidate: Serve from cache immediately, then update in background.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Cache First: Serve from cache if available, otherwise fetch from network and cache.
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        // Don't cache opaque responses (e.g., from third-party CDNs without CORS)
        if (networkResponse.type !== 'opaque') {
             cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Fetch failed for cache-first strategy:', error);
        // Optionally, return a placeholder image from the static cache
        if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(request.url)) {
            return caches.match('/placeholder.png'); // You would need to add this to your static assets
        }
    }
}
