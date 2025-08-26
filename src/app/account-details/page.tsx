
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export default function AccountDetailsPage() {
    const { user, loading, updateUserProfile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [displayName, setDisplayName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user, loading, router]);

    const getInitials = (name: string | null | undefined) => {
        if (!name || name.trim() === '') return "U";
        return name.trim()[0].toUpperCase();
    };

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await updateUserProfile({ displayName });
        setIsSubmitting(false);
    };

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline">Account Details</h1>
                <p className="text-muted-foreground">Manage your profile and account settings.</p>
            </header>

            <form onSubmit={handleProfileUpdate}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                                <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" onClick={() => toast({ title: "Feature coming soon!" })}>
                                Change Photo
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input 
                                    id="displayName" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)} 
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    id="email" 
                                    value={user.email || ''} 
                                    disabled 
                                />
                                <p className="text-xs text-muted-foreground">You can't change your email address.</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Set a new password for your account.</p>
                        </div>
                        <Button variant="outline" onClick={() => toast({ title: "Feature coming soon!" })}>
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                         <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                        </div>
                         <Button variant="destructive" onClick={() => toast({ title: "Feature coming soon!" })}>
                            Delete My Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
