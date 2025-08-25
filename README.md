
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling Push Notifications from the Admin Panel

To send push notifications from the "/admin/send-notification" page, the application needs access to your Firebase project's Admin SDK credentials.

1.  **Generate a Private Key:**
    *   Go to your Firebase Project Settings.
    *   Navigate to the "Service accounts" tab.
    *   Click the **"Generate new private key"** button. A JSON file will be downloaded.

2.  **Set the Environment Variable:**
    *   Open the downloaded JSON file in a text editor.
    *   Copy the **entire content** of the file.
    *   Open the `.env` file in the root of this project.
    *   Create a new variable named `GOOGLE_APPLICATION_CREDENTIALS`.
    *   Paste the copied JSON content as the value for the variable.

    **IMPORTANT:** The entire JSON object must be on a single line, and it should **NOT** be wrapped in quotes.

    **Example `.env` file:**

    ```env
    # CORRECT - No quotes, all on one line
    GOOGLE_APPLICATION_CREDENTIALS={"type": "service_account", "project_id": "...", ...}

    # INCORRECT - Do not wrap in single or double quotes
    # GOOGLE_APPLICATION_CREDENTIALS='{"type": "service_account", ...}'
    ```

After setting the environment variable, you will need to restart the development server for the changes to take effect. You can now send notifications from the "/admin/send-notification" page.
