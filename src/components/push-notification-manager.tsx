
"use client";

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase/config';
import { getToken, isSupported } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { subscribeToTopic } from '@/lib/firebase/actions';

export function PushNotificationManager() {
  const { toast } = useToast();

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
            // Subscribe the user to the 'all_users' topic on the server
            await subscribeToTopic(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        toast({
          title: "Notification Error",
          description: "Could not get permission for notifications. You might need to enable it in your browser settings.",
          variant: "destructive"
        })
      }
    };
    
    requestPermission();
  }, [toast]);

  return null; // This component does not render anything.
}
