
import admin from 'firebase-admin';

// This function is designed to be idempotent (safe to call multiple times).
export function initializeFirebaseAdmin() {
  // If the app is already initialized, don't do it again.
  if (admin.apps.length > 0) {
    return;
  }

  // Get the credentials from the environment variable.
  const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountKey) {
    console.error("Firebase Admin SDK Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    console.error("Please ensure your service account key JSON is correctly set in your .env file.");
    throw new Error("Firebase Admin credentials are not configured on the server.");
  }

  try {
    // Parse the JSON string from the environment variable.
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Provide a more specific error if JSON parsing fails.
    if (error instanceof SyntaxError) {
      console.error("The GOOGLE_APPLICATION_CREDENTIALS environment variable is not a valid JSON string.");
    }
    // Re-throw a user-friendly error to be caught by the action handler.
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}
