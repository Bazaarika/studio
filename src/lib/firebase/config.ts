
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Removed getMessaging from here to prevent premature initialization

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// **IMPORTANT**: Replace this with your own VAPID key from your Firebase project settings.
// See the README.md file for instructions on how to generate this key.
export const VAPID_KEY = 'BBRW5TymPqPDP2_jMxrUznjS3JfAF6f5QOhuY7HQTAWfhcFWWX9CzoRIHwJ_52OdOlbu1bj3A2d3WowZjtsIa1Q';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// messaging is no longer initialized here.
// It will be initialized on-demand in the component that needs it.

export { app, db, auth };
