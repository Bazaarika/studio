
'use server';

import admin from 'firebase-admin';
import { getMessaging } from "firebase-admin/messaging";

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    image?: string;
}

// This function initializes Firebase Admin SDK on-demand.
// It's designed to be idempotent (safe to call multiple times).
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountKey) {
    console.error("Firebase Admin SDK Error: GOOGLE_APPLICATION_CREDENTIALS env variable is not set.");
    throw new Error("Firebase Admin credentials are not configured on the server.");
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    // IMPORTANT: Replace escaped newlines in the private key
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    if (error instanceof SyntaxError) {
      console.error("The GOOGLE_APPLICATION_CREDENTIALS env variable is not a valid JSON string.");
    }
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}

/**
 * Subscribes a user's FCM token to the 'all_users' topic.
 */
export async function subscribeToTopic(token: string) {
    try {
        initializeFirebaseAdmin();
        await getMessaging().subscribeToTopic(token, "all_users");
        console.log(`Successfully subscribed token to topic: all_users`);
    } catch (error) {
        console.error("Error subscribing to topic:", error);
        // We don't throw here to avoid client-side errors for a background process.
    }
}


/**
 * Sends a push notification to all users subscribed to the 'all_users' topic.
 */
export async function sendPushNotification(payload: NotificationPayload) {
  try {
    initializeFirebaseAdmin();

    const message = {
      topic: "all_users",
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

    const response = await getMessaging().send(message);
    console.log("Successfully sent message:", response);
    return { success: true, messageId: response };

  } catch (error) {
    console.error("Error sending push notification:", error);
    // Re-throw the error to be caught by the client-side form handler
    throw new Error("Failed to send push notification.");
  }
}
