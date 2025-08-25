
"use client";

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase/config';
import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { subscribeToTopic } from '@/lib/firebase/actions';

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

  // Effect for requesting permission and getting token
  useEffect(() => {
    const requestPermissionAndSubscribe = async () => {
      const isMessagingSupported = await isSupported();
      if (!messaging || !isMessagingSupported) {
        console.log("Firebase Messaging is not supported in this browser.");
        return;
      }
      
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Unable to get permission to notify.');
          return;
        }

        console.log('Notification permission granted.');
        
        // VAPID key is a public key used by push services to identify the application server.
        const vapidKey = 'BBRz-6gqWxn_FwsA6bQz-u-0Tq-r_sE_hJ-8XyV8Zz-2wL7Y_zC6wR_jX-7Y_o_cK_xG_jQ_gY_hA-1i_xI_e-A';
        const currentToken = await getToken(messaging, { vapidKey });

        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // Token received, now send it to the server to subscribe.
          await subscribeToTopic(currentToken);
          console.log("Token sent to server for subscription.");
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } catch (error: any) {
        console.error('An error occurred during notification setup:', error);
        
        if (error.code === 'messaging/permission-blocked' || error.code === 'messaging/permission-default') {
            toast({
                title: "Notification Permission Needed",
                description: "Please enable notifications in your browser settings to receive updates.",
                variant: "destructive",
            });
        } else {
             toast({
                title: "Notification Registration Failed",
                description: "Could not register for notifications. Please ensure the Firebase Cloud Messaging API is enabled in your Google Cloud project.",
                variant: "destructive",
                duration: 10000
            });
        }
      }
    };
    
    // Delay the request slightly to ensure everything is loaded.
    const timer = setTimeout(() => {
        requestPermissionAndSubscribe();
    }, 2000);
    
    return () => clearTimeout(timer);

  }, [toast]);

  return null; // This component does not render anything.
}
