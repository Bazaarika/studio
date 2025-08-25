
// Import the Firebase app and messaging libraries
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// IMPORTANT: This file needs to be in the public directory.

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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Optional: If you want to handle background notifications here, you can add a listener.
// self.addEventListener('push', (event) => {
//   const payload = event.data.json();
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon || '/icon-192x192.svg',
//   };

//   event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
// });
