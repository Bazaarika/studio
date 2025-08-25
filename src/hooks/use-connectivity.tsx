
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useToast } from "./use-toast";

interface ConnectivityContextType {
  isOnline: boolean;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { toast, dismiss } = useToast();
  const offlineToastId = useRef<string | null>(null);

  useEffect(() => {
    // Set initial state from navigator
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        setIsOnline(window.navigator.onLine);
    }
  }, []);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineToastId.current) {
        dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }
      toast({
        title: "You're back online!",
        description: "Your internet connection was restored.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      const { id } = toast({
        title: "You are offline",
        description: "Please check your internet connection.",
        variant: "destructive",
        duration: Infinity, // Keep it visible until dismissed
      });
      offlineToastId.current = id;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast, dismiss]);

  return (
    <ConnectivityContext.Provider value={{ isOnline }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error("useConnectivity must be used within a ConnectivityProvider");
  }
  return context;
};
