
import admin from 'firebase-admin';

// This function is designed to be idempotent (safe to call multiple times).
export function initializeFirebaseAdmin() {
  // If the app is already initialized, don't do it again.
  if (admin.apps.length > 0) {
    return;
  }

  // The GOOGLE_APPLICATION_CREDENTIALS environment variable is expected to be
  // a JSON string. It is loaded by `dotenv` in the server action that calls this.
  const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountKey) {
    console.error("Firebase Admin SDK Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    throw new Error("Firebase Admin credentials are not configured on the server.");
  }

  try {
    const serviceAccountJson = JSON.parse(serviceAccountKey);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Re-throw a more user-friendly error to be caught by the action handler.
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}
