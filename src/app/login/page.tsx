
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Chrome, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function LoginPage() {
    const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: "Missing Fields",
                description: "Please enter both email and password.",
                variant: "destructive",
            });
            return;
        }
        setIsSubmitting(true);
        if (isSignUp) {
            await signUpWithEmail(email, password);
        } else {
            await signInWithEmail(email, password);
        }
        setIsSubmitting(false);
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (user) {
        return null;
    }

    return (
        <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="relative hidden md:block">
                <Image 
                    src="https://picsum.photos/800/1200" 
                    alt="Fashion model" 
                    fill 
                    className="object-cover"
                    data-ai-hint="fashion model"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-headline">
                            {isSignUp ? "Create an Account" : "Welcome Back"}
                        </h1>
                        <p className="text-muted-foreground">
                             {isSignUp ? "Enter your details to get started." : "Sign in to continue to your account."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                            OR
                        </span>
                    </div>

                    <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={signInWithGoogle}
                        disabled={loading}
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-primary hover:underline focus:outline-none">
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
