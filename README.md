
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications

To send and receive push notifications, you must perform two required, one-time setup steps in your Google Cloud and Firebase projects.

### 1. Enable the Firebase Cloud Messaging API

This API is required for your app to register for notifications.

1.  **Open the API Library:**
    *   Click this link to go directly to the correct page in the Google Cloud Console:
    *   [**Enable Firebase Cloud Messaging API**](https://console.cloud.google.com/apis/library/fcm.googleapis.com)

2.  **Select Your Project:**
    *   At the top of the page, ensure your project **`bazaarika-lite`** is selected. If not, click the project selector and choose it.

3.  **Enable the API:**
    *   Click the blue **"ENABLE"** button.
    *   Wait a moment for the process to complete.

### 2. Configure the VAPID Key in Your App Code

The VAPID key authenticates your web app with the push service.

1.  **Generate VAPID Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the **"Cloud Messaging"** tab.
    *   Under **"Web configuration"**, find the **"Web Push certificates"** section.
    *   Click the **"Generate key pair"** button. A key pair will be generated.

2.  **Set the VAPID Key in Code:**
    *   Copy the long string of characters from the **"Key pair"** field.
    *   Open the file `src/lib/firebase/config.ts` in your code editor.
    *   Find the line that says `export const VAPID_KEY = '...';`
    *   Replace the existing key placeholder with the key you just copied.

After completing both steps, reload your application. The "Could not get permission for notifications" error should be resolved, and your app will be able to register for and receive notifications.

## Sending Push Notifications from the Admin Panel

To send push notifications from the "/admin/send-notification" page, the application needs access to your Firebase project's Admin SDK credentials. This is done via environment variables.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the **"Service accounts"** tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Set Environment Variables:**
    *   Create a new file named `.env` in the root of your project (or open the existing one).
    *   Open the downloaded JSON file. You will need three values from it: `project_id`, `client_email`, and `private_key`.
    *   Add the following lines to your `.env` file, replacing the placeholder values with the ones from your JSON file:

    ```bash
    FIREBASE_PROJECT_ID=your-project-id-from-json
    FIREBASE_CLIENT_EMAIL=your-client-email-from-json
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_VERY_LONG_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
    ```

    **Important Note for `FIREBASE_PRIVATE_KEY`:**
    *   You **must** wrap the entire private key in double quotes (`"`).
    *   The `\n` characters within the key are important and must be kept exactly as they are in the JSON file.

After adding these variables, you will need to **restart the development server** for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.
