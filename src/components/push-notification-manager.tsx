
"use client";

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase/config';
import { onMessage } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';

export function PushNotificationManager() {
  const { toast } = useToast();

  // Effect for handling foreground messages
  useEffect(() => {
    if (typeof window === 'undefined' || !messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received. ', payload);
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "",
      });
    });

    return () => unsubscribe();
  }, [toast]);


  // We have moved the subscription logic to a user-initiated action on the profile page.
  // This component will now only be responsible for handling foreground messages when the app is open.

  return null; // This component does not render anything.
}
