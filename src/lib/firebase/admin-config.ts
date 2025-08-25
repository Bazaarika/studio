
import admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  // If the app is already initialized, don't do it again
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountKey) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    }

    let serviceAccountJson;
    try {
        serviceAccountJson = JSON.parse(serviceAccountKey);
    } catch(e) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS. Make sure it's a valid JSON string with no extra characters or line breaks.", e);
        throw new Error("Invalid format for Firebase Admin credentials.");
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });

  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Re-throw the error to make it clear that initialization failed
    throw new Error("Could not initialize Firebase Admin SDK.");
  }
}
