
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This function is designed to be idempotent (safe to call multiple times).
export function initializeFirebaseAdmin() {
  // If the app is already initialized, don't do it again.
  if (admin.apps.length > 0) {
    return;
  }

  // Use a dedicated service account file for credentials.
  // This is more reliable than environment variables in some serverless environments.
  const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("Firebase Admin SDK Error: `service-account.json` file not found.");
    console.error("Please download your service account key from the Firebase console and place it in the root of your project as `service-account.json`.");
    throw new Error("Firebase Admin credentials are not configured on the server.");
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Re-throw a more user-friendly error to be caught by the action handler.
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}
