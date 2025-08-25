
"use client";

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase/config';
import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { subscribeToTopic } from '@/lib/firebase/actions';

export function PushNotificationManager() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined' || !messaging) return;

    // Handle incoming messages when the app is in the foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received. ', payload);
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "",
      });
    });

    return () => {
      unsubscribe(); // Unsubscribe from the onMessage listener when the component unmounts
    };
  }, [toast]);


  useEffect(() => {
    const requestPermission = async () => {
      const supported = await isSupported();
      if (!messaging || !supported) {
        console.log("Firebase Messaging is not supported in this browser.");
        return;
      }
      
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          // VAPID key is a public key used by push services to identify the application server.
          // It is safe to expose this in client-side code.
          const currentToken = await getToken(messaging, { 
            vapidKey: 'BBRz-6gqWxn_FwsA6bQz-u-0Tq-r_sE_hJ-8XyV8Zz-2wL7Y_zC6wR_jX-7Y_o_cK_xG_jQ_gY_hA-1i_xI_e-A'
          });

          if (currentToken) {
            console.log('FCM Token:', currentToken);
            await subscribeToTopic(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (error: any) {
        console.error('An error occurred while requesting permission or getting token: ', error);
        
        // Provide more specific feedback to the user
        if (error.code === 'messaging/token-subscribe-failed') {
             toast({
                title: "Notification Registration Failed",
                description: "Could not register for notifications. Please ensure the Firebase Cloud Messaging API is enabled in your Google Cloud project.",
                variant: "destructive",
                duration: 10000
            });
        } else {
            toast({
                title: "Notification Error",
                description: "Could not get permission for notifications. You might need to enable it in your browser settings.",
                variant: "destructive"
            });
        }
      }
    };
    
    // Delay the request slightly to ensure everything is loaded.
    const timer = setTimeout(() => {
        requestPermission();
    }, 2000);
    
    return () => clearTimeout(timer);

  }, [toast]);

  return null; // This component does not render anything.
}
