
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications

To send and receive push notifications, you must enable the Firebase Cloud Messaging API in your Google Cloud project. This is a required, one-time setup step.

1.  **Open the API Library:**
    *   Click this link to go directly to the correct page in the Google Cloud Console:
    *   [**Enable Firebase Cloud Messaging API**](https://console.cloud.google.com/apis/library/fcm.googleapis.com)

2.  **Select Your Project:**
    *   At the top of the page, ensure your project **`bazaarika-lite`** is selected. If not, click the project selector and choose it.

3.  **Enable the API:**
    *   Click the blue **"ENABLE"** button.
    *   Wait a moment for the process to complete.

After enabling the API, reload your application. The "Could not get permission for notifications" error should be resolved, and your app will be able to register for and receive notifications.

## Sending Push Notifications from the Admin Panel

To send push notifications from the "/admin/send-notification" page, the application needs access to your Firebase project's Admin SDK credentials.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the **"Service accounts"** tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Set the Environment Variable:**
    *   Open the downloaded JSON file in a text editor.
    *   Copy the **entire content** of the file.
    *   Open the `.env` file in the root of your project.
    *   Add the following line, pasting the copied JSON content directly after the `=` sign. The entire JSON must be on a single line.

    ```env
    GOOGLE_APPLICATION_CREDENTIALS=<PASTE_YOUR_ENTIRE_JSON_CONTENT_HERE>
    ```

After adding the variable, you will need to **restart the development server** for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.
