
// Import and initialize the Firebase SDK
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
  authDomain: "bazaarika-lite.firebaseapp.com",
  projectId: "bazaarika-lite",
  storageBucket: "bazaarika-lite.firebasestorage.app",
  messagingSenderId: "497294677028",
  appId: "1:497294677028:web:d6500602307f6d462c74b1",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  
  const notificationPayload = event.data.json();
  const notificationTitle = notificationPayload.notification.title;
  const notificationOptions = {
    body: notificationPayload.notification.body,
    icon: notificationPayload.notification.icon || '/icon-192x192.svg',
    image: notificationPayload.notification.image,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Optional: Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
