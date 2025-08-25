
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";
import { addToUserWishlist, getUserWishlist, mergeWishlists, removeFromUserWishlist } from "@/lib/firebase/firestore";

const LOCAL_STORAGE_KEY = 'wishlist';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getLocalWishlist = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      return [];
    }
  };

  const setLocalWishlist = (list: string[]) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
       console.error("Failed to save wishlist to localStorage", error);
    }
  };

  useEffect(() => {
    const syncWishlist = async () => {
        setLoading(true);
        if (user) {
            // User is logged in
            const localWishlist = getLocalWishlist();
            if (localWishlist.length > 0) {
                // Merge local wishlist to Firestore
                await mergeWishlists(user.uid, localWishlist);
                // Clear local wishlist after merging
                setLocalWishlist([]); 
            }
            // Fetch the now-updated wishlist from Firestore
            const firestoreWishlist = await getUserWishlist(user.uid);
            setWishlist(firestoreWishlist);
        } else {
            // User is not logged in, use local storage
            setWishlist(getLocalWishlist());
        }
        setLoading(false);
    };

    syncWishlist();
  }, [user]);


  const addToWishlist = useCallback(async (productId: string) => {
    if (wishlist.includes(productId)) return; // Already in wishlist

    const newWishlist = [...wishlist, productId];
    setWishlist(newWishlist); // Optimistic update

    if (user) {
      await addToUserWishlist(user.uid, productId);
    } else {
      setLocalWishlist(newWishlist);
    }
  }, [user, wishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(newWishlist); // Optimistic update

    if (user) {
      await removeFromUserWishlist(user.uid, productId);
    } else {
      setLocalWishlist(newWishlist);
    }
  }, [user, wishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
