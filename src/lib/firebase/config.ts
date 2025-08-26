
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Removed getMessaging from here to prevent premature initialization

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
  authDomain: "bazaarika-lite.firebaseapp.com",
  projectId: "bazaarika-lite",
  storageBucket: "bazaarika-lite.firebasestorage.app",
  messagingSenderId: "497294677028",
  appId: "1:497294677028:web:d6500602307f6d462c74b1",
};

// **IMPORTANT**: Replace this with your own VAPID key from your Firebase project settings.
export const VAPID_KEY = 'BBRW5TymPqPDP2_jMxrUznjS3JfAF6f5QOhuY7HQTAWfhcFWWX9CzoRIHwJ_52OdOlbu1bj3A2d3WowZjtsIa1Q';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// messaging is no longer initialized here.
// It will be initialized on-demand in the component that needs it.

export { app, db, auth };
