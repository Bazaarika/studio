
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
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
    updateProfile,
    AuthError
} from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getUserAddress, updateUserAddress, type Address } from "@/lib/firebase/firestore";


interface UserUpdatePayload {
    displayName?: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    address: Address | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    updateUserProfile: (payload: UserUpdatePayload) => Promise<void>;
    saveAddress: (address: Address) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch address concurrently
                const userAddress = await getUserAddress(user.uid);
                setAddress(userAddress);
                setUser(user);
            } else {
                // User is signed out
                setUser(null);
                setAddress(null);
            }
            // Only set loading to false after all initial data is fetched
            setLoading(false);
        });

        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    toast({ title: "Signed in successfully!"});
                    router.push('/profile');
                }
            })
            .catch((error) => {
                if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                    console.error("Error getting redirect result:", error);
                    toast({
                        title: "Sign-in failed",
                        description: "Could not complete sign in with Google. Please try again.",
                        variant: "destructive"
                    });
                }
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
            toast({
                title: "Authentication Error",
                description: "Could not start sign-in process. Please try again.",
                variant: "destructive",
            });
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

    const updateUserProfile = async (payload: UserUpdatePayload) => {
        if (!auth.currentUser) {
            toast({ title: "Not signed in", description: "You must be signed in to update your profile.", variant: "destructive"});
            return;
        }
        try {
            await updateProfile(auth.currentUser, payload);
            // Manually update the user state to reflect changes immediately
            setUser({ ...auth.currentUser });
            toast({
                title: "Profile Updated!",
                description: "Your changes have been saved successfully."
            })
        } catch (error) {
            console.error("Error updating profile", error);
            toast({
                title: "Update Failed",
                description: "Could not save your profile changes. Please try again.",
                variant: "destructive"
            })
        }
    };
    
    const saveAddress = async (address: Address) => {
        if (!user) {
            toast({ title: "Not signed in", variant: "destructive" });
            return;
        }
        try {
            await updateUserAddress(user.uid, address);
            setAddress(address);
            toast({ title: "Address saved!" });
        } catch (error) {
            toast({ title: "Error saving address", variant: "destructive" });
        }
    };

    return (
        <AuthContext.Provider value={{ user, address, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, updateUserProfile, saveAddress }}>
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
