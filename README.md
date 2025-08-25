
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications from the Admin Panel

To send push notifications from the "/admin/send-notification" page, the application needs access to your Firebase project's Admin SDK credentials via a service account file.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the **"Service accounts"** tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Add the File to Your Project:**
    *   Rename the downloaded JSON file to **`service-account.json`**.
    *   Move this file to the **root directory** of your project (the same folder where `package.json` is located).

The `service-account.json` file is listed in `.gitignore`, so it will not be committed to your repository.

After adding the file, you will need to restart the development server for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.
