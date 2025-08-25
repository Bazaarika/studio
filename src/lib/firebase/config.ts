
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCWpvks_5q1nSBhsrYlNLIRX9UBZ-ZkbXA",
  authDomain: "bazaarika-lite.firebaseapp.com",
  projectId: "bazaarika-lite",
  storageBucket: "bazaarika-lite.firebasestorage.app",
  messagingSenderId: "497294677028",
  appId: "1:497294677028:web:d6500602307f6d462c74b1",
};

// **IMPORTANT**: Replace this with your own VAPID key from your Firebase project settings.
export const VAPID_KEY = 'BBRz-6gqWxn_FwsA6bQz-u-0Tq-r_sE_hJ-8XyV8Zz-2wL7Y_zC6wR_jX-7Y_o_cK_xG_jQ_gY_hA-1i_xI_e-A';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = (typeof window !== 'undefined') ? getMessaging(app) : null;


export { app, db, auth, messaging };
