
'use server';

import admin from 'firebase-admin';
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from '../../../services.json';

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
    const serviceAccountParams = {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
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
 * Subscribes a user's FCM token to a specific topic.
 * This is a server-only action.
 */
export async function subscribeToTopic(token: string, topic: string) {
    try {
        const app = initializeFirebaseAdmin();
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
