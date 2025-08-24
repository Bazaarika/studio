
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Chrome } from "lucide-react";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

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
