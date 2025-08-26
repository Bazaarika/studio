// Import the Firebase app and messaging libraries using importScripts.
// These are the latest stable versions of the Firebase SDK.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration.
// It's safe to expose this in the service worker.
const firebaseConfig = {
  apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
  authDomain: "bazaarika-lite.firebaseapp.com",
  projectId: "bazaarika-lite",
  storageBucket: "bazaarika-lite.appspot.com",
  messagingSenderId: "497294677028",
  appId: "1:497294677028:web:d6500602307f6d462c74b1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Messaging service.
const messaging = firebase.messaging(app);

// Optional: Handle background messages here.
// When a push message is received, this handler will be called.
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.svg', // A default icon for your notifications
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
