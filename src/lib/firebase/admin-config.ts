
import admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  // If the app is already initialized, don't do it again
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountKey) {
        console.error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
        // This is a server-side error, so we can throw to indicate a critical misconfiguration
        throw new Error("Firebase Admin credentials are not set in the environment.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });

  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Re-throw the error to make it clear that initialization failed
    throw new Error("Could not initialize Firebase Admin SDK.");
  }
}
