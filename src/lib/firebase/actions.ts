
'use server';

// Helper function to initialize Firebase Admin SDK safely
async function initializeFirebaseAdmin() {
  const admin = await import('firebase-admin');
  if (admin.apps.length > 0) {
    return admin; // Return the already initialized admin object
  }
  
  // Check if the necessary environment variables are set
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn("Firebase Admin credentials environment variables are not set. Push notifications from the admin panel will fail. See README.md for setup instructions.");
      return null;
  }

  // Use environment variables to create the service account object
  const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  } as admin.ServiceAccount;

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error("Could not initialize Firebase Admin SDK. Please check server logs for details.");
  }
}

interface NotificationPayload {
    title: string;
    body: string;
    topic: string;
    icon?: string;
    image?: string;
}

/**
 * Subscribes a user's FCM token to a specific topic.
 * This is a server-only action.
 */
export async function subscribeToTopic(token: string, topic: string) {
    try {
        const admin = await initializeFirebaseAdmin();
        if (!admin) throw new Error("Firebase Admin SDK not initialized. Check credentials.");
        
        const messaging = await import('firebase-admin/messaging');
        await messaging.getMessaging().subscribeToTopic(token, topic);
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
    const admin = await initializeFirebaseAdmin();
    if (!admin) throw new Error("Firebase Admin SDK not initialized. Check your environment variables.");

    const messaging = await import('firebase-admin/messaging');

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

    const response = await messaging.getMessaging().send(message);
    console.log("Successfully sent message:", response);
    return { success: true, messageId: response };

  } catch (error) {
    console.error("Error sending push notification:", error);
    // Re-throw the error to be caught by the client-side form handler
    throw new Error("Failed to send push notification.");
  }
}

/**
 * Activates a vendor's Firebase Auth account.
 */
export async function activateVendorAccount(uid: string) {
    const admin = await initializeFirebaseAdmin();
    if (!admin) throw new Error("Firebase Admin SDK not initialized.");
    await admin.auth().updateUser(uid, { disabled: false });
}

/**
 * Sends an email to the vendor upon approval.
 * NOTE: This is a placeholder. For a real app, you would integrate a service like SendGrid, Mailgun, or use the Firebase "Trigger Email" extension.
 */
export async function sendVendorApprovalEmail(email: string) {
    console.log(`
    =================================================
    SIMULATING VENDOR APPROVAL EMAIL
    =================================================
    TO: ${email}
    FROM: no-reply@bazaarika.com
    SUBJECT: Your Vendor Application has been Approved!

    Hello,

    Congratulations! Your application to become a seller on Bazaarika has been approved.
    You can now log in to your vendor dashboard using the email and password you registered with.

    Login here: [YOUR_LOGIN_URL]

    Welcome aboard!
    The Bazaarika Team
    =================================================
    `);
    // In a real app, you would have your email sending logic here.
    return { success: true };
}
