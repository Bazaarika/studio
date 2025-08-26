
"use client";

import { useEffect } from 'react';
import { getMessaging, onMessage, isSupported } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase/config';

export function PushNotificationManager() {
  const { toast } = useToast();

  // Effect for handling foreground messages
  useEffect(() => {
    const initializeForegroundMessaging = async () => {
      // Check for support first
      const supported = await isSupported();
      if (typeof window !== 'undefined' && supported) {
        const messaging = getMessaging(app);
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground message received. ', payload);
          toast({
            title: payload.notification?.title || "New Notification",
            description: payload.notification?.body || "",
          });
        });
        return () => unsubscribe();
      }
    };

    initializeForegroundMessaging();
  }, [toast]);

  // Subscription logic has been moved to a user-initiated action on the profile page.
  // This component is now only responsible for handling foreground messages when the app is open.

  return null; // This component does not render anything.
}
