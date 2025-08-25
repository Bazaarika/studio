
'use server';

import { getMessaging } from "firebase-admin/messaging";
import { initializeFirebaseAdmin } from "./admin-config";

interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    image?: string;
}

/**
 * Subscribes a user's FCM token to the 'all_users' topic.
 */
export async function subscribeToTopic(token: string) {
    try {
        // Initialize on-demand
        initializeFirebaseAdmin();
        await getMessaging().subscribeToTopic(token, "all_users");
        console.log(`Successfully subscribed token to topic: all_users`);
    } catch (error) {
        console.error("Error subscribing to topic:", error);
        // It's okay to not throw here, as it's a background process
    }
}


/**
 * Sends a push notification to all users subscribed to the 'all_users' topic.
 */
export async function sendPushNotification(payload: NotificationPayload) {
  // Initialize on-demand to ensure env vars are loaded and the app is ready.
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

  try {
    const response = await getMessaging().send(message);
    console.log("Successfully sent message:", response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error("Error sending push notification:", error);
    // Re-throw the error to be caught by the client-side form handler
    throw new Error("Failed to send push notification.");
  }
}
