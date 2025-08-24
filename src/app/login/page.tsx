
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Chrome, Loader2 } from "lucide-react";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // This effect will run when the user is already logged in and visits the login page.
        // It redirects them to their profile, preventing them from seeing the login page again.
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    // Show a loading state while we check if the user is already authenticated or during the redirect process.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Authenticating...</p>
                </div>
            </div>
        );
    }
    
    // If the user is logged in, this component will redirect, so we can return null
    // to avoid a flash of the login form.
    if (user) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                    <CardDescription>Sign in to continue to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        className="w-full" 
                        onClick={signInWithGoogle}
                        disabled={loading}
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
