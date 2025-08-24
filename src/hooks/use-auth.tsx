
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, signOut as firebaseSignOut, User, getRedirectResult } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Check for redirect result on initial load
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    // This means the user has just signed in via redirect.
                    // onAuthStateChanged will handle setting the user.
                    // We can redirect them to their profile.
                    router.push('/profile');
                }
            })
            .catch((error) => {
                console.error("Error getting redirect result:", error);
                toast({
                    title: "Authentication Error",
                    description: "Could not complete sign-in. Please ensure your domain is authorized in Firebase.",
                    variant: "destructive",
                });
            });

        return () => unsubscribe();
    }, [router, toast]);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true); // Set loading state before redirect
        try {
            await signInWithRedirect(auth, provider);
        } catch (error: any) {
            console.error("Error initiating sign-in with Google", error);
            toast({
                title: "Authentication Error",
                description: "An error occurred during sign-in. Please try again.",
                variant: "destructive",
            });
            setLoading(false); // Reset loading on error
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            // Redirect to home or login page after sign out
            router.push('/login');
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
