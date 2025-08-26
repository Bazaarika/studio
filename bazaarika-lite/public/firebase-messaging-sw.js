// Import the Firebase app and messaging services using importScripts
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
    authDomain: "bazaarika-lite.firebaseapp.com",
    projectId: "bazaarika-lite",
    storageBucket: "bazaarika-lite.appspot.com",
    messagingSenderId: "497294677028",
    appId: "1:497294677028:web:d6500602307f6d462c74b1",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// Optional: To handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
