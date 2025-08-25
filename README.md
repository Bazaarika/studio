
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications from the Admin Panel

To send push notifications, the application needs access to your Firebase project's Admin SDK credentials.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the "Service accounts" tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Set the Environment Variable:**
    *   Open the downloaded JSON file in a text editor.
    *   Copy the **entire content** of the file.
    *   Open the `.env` file in the root of this project.
    *   Paste the copied JSON content as the value for the `GOOGLE_APPLICATION_CREDENTIALS` variable. Make sure the entire JSON object is on a single line.

    **Example `.env` file:**
    ```
    GOOGLE_APPLICATION_CREDENTIALS='{"type": "service_account", "project_id": "...", ...}'
    ```

After setting the environment variable, you will need to restart the development server for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.
