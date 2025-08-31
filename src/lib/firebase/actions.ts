
'use server';

import admin from 'firebase-admin';
import { getMessaging } from "firebase-admin/messaging";

interface NotificationPayload {
    title: string;
    body: string;
    topic: string;
    icon?: string;
    image?: string;
}

// Helper function to initialize Firebase Admin SDK safely
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app(); // Return the already initialized app
  }
  
  try {
    // Check if the necessary environment variables are set
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        console.warn("Firebase Admin credentials environment variables are not set. Push notifications from the admin panel will fail. See README.md for setup instructions.");
        // We can't proceed with initialization, so we'll let it fail later if used.
        // We don't throw an error here to allow the rest of the app to build.
        return null;
    }

    // Use environment variables to create the service account object
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to be parsed correctly as it's often stored with escaped newlines
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}

/**
 * Subscribes a user's FCM token to a specific topic.
 * This is a server-only action.
 */
export async function subscribeToTopic(token: string, topic: string) {
    try {
        const app = initializeFirebaseAdmin();
        if (!app) throw new Error("Firebase Admin SDK not initialized. Check credentials.");
        await getMessaging(app).subscribeToTopic(token, topic);
        console.log(`Successfully subscribed token to topic: ${topic}`);
    } catch (error) {
        console.error(`Error subscribing to topic ${topic}:`, error);
        throw new Error(`Failed to subscribe to topic: ${topic}`);
    }
}


/**
 * Sends a push notification to all users subscribed to a specific topic.
 */
export async function sendPushNotification(payload: NotificationPayload) {
  try {
    const app = initializeFirebaseAdmin();
    if (!app) throw new Error("Firebase Admin SDK not initialized. Check your environment variables.");

    const message = {
      topic: payload.topic,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      webpush: {
        notification: {
          icon: payload.icon || "/icon-192x192.svg",
          image: payload.image,
        },
      },
    };

    const response = await getMessaging(app).send(message);
    console.log("Successfully sent message:", response);
    return { success: true, messageId: response };

  } catch (error) {
    console.error("Error sending push notification:", error);
    // Re-throw the error to be caught by the client-side form handler
    throw new Error("Failed to send push notification.");
  }
}
