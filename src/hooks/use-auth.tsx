
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, signOut as firebaseSignOut, User, getRedirectResult } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Check for redirect result on initial load
        getRedirectResult(auth).catch((error) => {
            console.error("Error getting redirect result:", error);
             toast({
                title: "Authentication Error",
                description: "Could not complete sign-in. Please ensure your domain is authorized in Firebase.",
                variant: "destructive",
            });
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            // We use signInWithRedirect now which is more reliable than popup.
            // The result is handled by the getRedirectResult in the useEffect.
            await signInWithRedirect(auth, provider);
        } catch (error: any) {
            console.error("Error initiating sign-in with Google", error);
            toast({
                title: "Authentication Error",
                description: "An error occurred during sign-in. Please try again.",
                variant: "destructive",
            });
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
