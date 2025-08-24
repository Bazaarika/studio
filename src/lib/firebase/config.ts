
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Dynamically determine the authDomain
const getAuthDomain = () => {
  if (typeof window !== 'undefined') {
    // On the client side, use the current window's hostname
    return window.location.hostname;
  }
  // On the server side, we can fall back to the default or leave it to be set client-side.
  // For client-side auth like Google Popup, this will be handled correctly in the browser.
  return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
};


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: getAuthDomain(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getApp ? getAuth(app) : undefined; // Ensure auth is only initialized on client

export { app, db, auth };
