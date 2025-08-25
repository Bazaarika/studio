
import admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountKey) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
    console.log('Firebase Admin SDK initialized successfully.');

  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Avoid crashing the server on init failure, log the error instead.
  }
}
