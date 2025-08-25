
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications from the Admin Panel

To send push notifications from the "/admin/send-notification" page, the application needs access to your Firebase project's Admin SDK credentials. This is done via an environment variable.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the **"Service accounts"** tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Set the Environment Variable:**
    *   Open the downloaded JSON file in a text editor.
    *   Copy the **entire content** of the file.
    *   Open the `.env` file in the root of your project.
    *   Add the following line, pasting the copied JSON content directly after the `=` sign.

    ```env
    GOOGLE_APPLICATION_CREDENTIALS=<PASTE_YOUR_ENTIRE_JSON_CONTENT_HERE>
    ```

    **Important:** The JSON content must be a single line. Do not add any quotes (`"` or `'`) around the JSON.

After adding the variable, you will need to **restart the development server** for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.

The `.env` file is already listed in `.gitignore`, so your credentials will not be committed to your repository.
