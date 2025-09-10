
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
import { doc, onSnapshot, Unsubscribe, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { updateUserAddress, type Address, updateUserPhone, type VendorApplicationData } from "@/lib/firebase/firestore";
import { activateVendorAccount } from "@/lib/firebase/actions";

type UserRole = 'admin' | 'vendor' | 'customer';

interface UserUpdatePayload {
    displayName?: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    address: Address | null;
    phone: string | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    registerVendor: (vendorData: VendorApplicationData) => Promise<void>;
    updateUserProfile: (payload: UserUpdatePayload) => Promise<void>;
    saveAddress: (address: Address) => Promise<void>;
    savePhone: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

// Helper functions for localStorage
const getUserFromCache = (): User | null => {
    if (typeof window === 'undefined') return null;
    const cachedUser = localStorage.getItem('bazaarika-user');
    return cachedUser ? JSON.parse(cachedUser) : null;
};

const setUserInCache = (user: User | null) => {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem('bazaarika-user', JSON.stringify(user));
    } else {
        localStorage.removeItem('bazaarika-user');
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getUserFromCache);
    const [role, setRole] = useState<UserRole | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const updateUserDocument = async (user: User) => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const existingRole = userDoc.exists() ? userDoc.data().role : undefined;

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: existingRole || 'customer', // If role exists use it, otherwise default to 'customer'
        };
        // Use setDoc with merge:true to create or update the document
        await setDoc(userDocRef, userData, { merge: true });
    };

    useEffect(() => {
        let unsubscribeFromFirestore: Unsubscribe | null = null;

        const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
            // Unsubscribe from any previous Firestore listener
            if (unsubscribeFromFirestore) {
                unsubscribeFromFirestore();
            }

            if (user) {
                setUser(user);
                setUserInCache(user);
                updateUserDocument(user); // Sync user data to Firestore on auth change
                
                const userDocRef = doc(db, "users", user.uid);
                unsubscribeFromFirestore = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setRole(data.role || 'customer');
                        setAddress(data.address || null);
                        setPhone(data.phone || null);
                    } else {
                        setRole('customer');
                        setAddress(null);
                        setPhone(null);
                    }
                    if (loading) setLoading(false);
                }, (error) => {
                    console.error("Error with Firestore listener:", error);
                    if (loading) setLoading(false);
                });

            } else {
                setUser(null);
                setUserInCache(null);
                setRole(null);
                setAddress(null);
                setPhone(null);
                if (loading) setLoading(false);
            }
        });

        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    toast({ title: "Signed in successfully!"});
                    // Role-based redirect can be added here later
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

        return () => {
            unsubscribeFromAuth();
            if (unsubscribeFromFirestore) {
                unsubscribeFromFirestore();
            }
        };
    }, [router, toast, loading]);

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
            case 'auth/user-disabled':
                title = "Account Pending";
                description = "Your account is awaiting approval from an administrator.";
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Explicitly set role for new email sign-ups
            const userDocRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userDocRef, { role: 'customer' }, { merge: true });
            router.push('/profile');
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const registerVendor = async (vendorData: VendorApplicationData) => {
        const { email, password, contactName, ...vendorDetails } = vendorData;
        
        // 1. Create a temporary, disabled user in Firebase Auth
        const tempAuth = getAuth(app); // Use a separate instance if needed, but not strictly necessary
        const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
        const user = userCredential.user;

        // 2. Disable the account immediately
        await activateVendorAccount(user.uid); // This server action will actually disable it initially. We re-enable on approval.
        
        // This is a workaround since client-side cannot disable users. The backend function should handle this.
        // For now, we rely on Firestore status. In a real app, a Cloud Function would create a disabled user.
        
        // 3. Create the user document in Firestore with 'pending' status
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: contactName,
            role: 'vendor',
            status: 'pending',
            ...vendorDetails,
        });

        // 4. Sign out the temporary user
        await firebaseSignOut(tempAuth);
    };

    const signInWithEmail = async (email: string, pass: string) => {
         setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // Role will be fetched by onAuthStateChanged, then redirect
        } catch (error) {
            handleAuthError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUserInCache(null); // Clear cache on sign out
            router.push('/login');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const updateUserProfile = async (payload: UserUpdatePayload) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast({ title: "Not signed in", description: "You must be signed in to update your profile.", variant: "destructive"});
            return;
        }
        try {
            await updateProfile(currentUser, payload);
            // Manually update the user state and cache to reflect changes immediately
            const updatedUser = { ...currentUser, ...payload } as User;
            setUser(updatedUser);
            setUserInCache(updatedUser);
            // Also update the user's document in Firestore
            await updateUserDocument(updatedUser);
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
            // onSnapshot will handle the state update
            toast({ title: "Address saved!" });
        } catch (error) {
            toast({ title: "Error saving address", variant: "destructive" });
        }
    };

    const savePhone = async (phone: string) => {
        if (!user) {
            toast({ title: "Not signed in", variant: "destructive" });
            return;
        }
        try {
            await updateUserPhone(user.uid, phone);
            // onSnapshot will handle the state update
            toast({ title: "Phone number saved!" });
        } catch (error) {
            toast({ title: "Error saving phone number", variant: "destructive" });
        }
    };


    return (
        <AuthContext.Provider value={{ user, role, address, phone, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, registerVendor, updateUserProfile, saveAddress, savePhone }}>
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
