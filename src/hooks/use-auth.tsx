
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithRedirect, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut, 
    User, 
    getRedirectResult,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    AuthError
} from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
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

        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    router.push('/profile');
                }
            })
            .catch((error) => {
                console.error("Error getting redirect result:", error);
            });

        return () => unsubscribe();
    }, [router, toast]);

    const handleAuthError = (error: AuthError) => {
        let title = "Authentication Error";
        let description = "An unexpected error occurred. Please try again.";

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                title = "Invalid Credentials";
                description = "The email or password you entered is incorrect.";
                break;
            case 'auth/email-already-in-use':
                title = "Email In Use";
                description = "This email address is already associated with an account.";
                break;
            case 'auth/weak-password':
                title = "Weak Password";
                description = "Your password must be at least 6 characters long.";
                break;
            case 'auth/invalid-email':
                 title = "Invalid Email";
                description = "Please enter a valid email address.";
                break;
        }

        toast({ title, description, variant: "destructive" });
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Google sign-in error", error);
            if (error instanceof Error && 'code' in error && error.code !== 'auth/popup-closed-by-user') {
                 toast({
                    title: "Authentication Error",
                    description: "Could not complete sign-in. Please try again.",
                    variant: "destructive",
                });
            }
            setLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            router.push('/profile');
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
         setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            router.push('/profile');
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail }}>
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
