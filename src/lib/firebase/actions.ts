
'use server';

import { getMessaging } from "firebase-admin/messaging";
import { initializeFirebaseAdmin } from "./admin-config";

// Initialize Firebase Admin
initializeFirebaseAdmin();

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
    console.error("Error sending message:", error);
    throw new Error("Failed to send push notification.");
  }
}
