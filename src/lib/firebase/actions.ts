
'use server';

import admin from 'firebase-admin';
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from '../../../services.json';

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    image?: string;
}

// Helper function to initialize Firebase Admin SDK safely
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app(); // Return the already initialized app
  }
  
  try {
    const serviceAccountParams = {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), // Important for env variables
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccountParams),
    });

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}

/**
 * Subscribes a user's FCM token to the 'all_users' topic.
 * This is a server-only action.
 */
export async function subscribeToTopic(token: string) {
    try {
        const app = initializeFirebaseAdmin();
        await getMessaging(app).subscribeToTopic(token, "all_users");
        console.log(`Successfully subscribed token to topic: all_users`);
    } catch (error) {
        console.error("Error subscribing to topic:", error);
        // We don't throw here to avoid client-side errors for a background process,
        // but we log it to the server console.
    }
}


/**
 * Sends a push notification to all users subscribed to the 'all_users' topic.
 */
export async function sendPushNotification(payload: NotificationPayload) {
  try {
    const app = initializeFirebaseAdmin();

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

    const response = await getMessaging(app).send(message);
    console.log("Successfully sent message:", response);
    return { success: true, messageId: response };

  } catch (error) {
    console.error("Error sending push notification:", error);
    // Re-throw the error to be caught by the client-side form handler
    throw new Error("Failed to send push notification.");
  }
}
