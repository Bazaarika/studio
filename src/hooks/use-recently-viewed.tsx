
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

const MAX_RECENTLY_VIEWED = 10;
const LOCAL_STORAGE_KEY = 'recentlyViewed';

interface RecentlyViewedContextType {
  recentlyViewedIds: string[];
  addProductToRecentlyViewed: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to parse recently viewed items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentlyViewedIds));
    } catch (error) {
       console.error("Failed to save recently viewed items to localStorage", error);
    }
  }, [recentlyViewedIds]);

  const addProductToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prevIds) => {
      // Remove the product if it already exists to move it to the front
      const newIds = prevIds.filter(id => id !== productId);
      // Add the new product to the beginning of the array
      newIds.unshift(productId);
      // Limit the array to the max size
      return newIds.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewedIds, addProductToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
};
