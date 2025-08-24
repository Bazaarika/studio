
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Edit, LogOut, MapPin, User, Shield, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    // Redirect to login page if not loading and no user is found
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
        setDisplayName(user.displayName || '');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    // Show a loading indicator or a blank screen while checking auth state
    // and redirecting. This prevents rendering the profile page for a split second.
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  const handleSaveChanges = async () => {
    if (!displayName.trim()) {
        toast({
            title: "Name cannot be empty",
            variant: "destructive"
        });
        return;
    }
    setIsSaving(true);
    await updateUserProfile({ displayName });
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline">{user.displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <User className="h-5 w-5"/>
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input 
                                id="display-name" 
                                value={displayName} 
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} readOnly disabled/>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Saving...
                            </>
                        ) : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                       <MapPin className="h-5 w-5"/>
                        Shipping Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        You have not set a default shipping address.
                    </p>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4"/>
                        Add Address
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
            <Button variant="outline" className="w-full" asChild>
                <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                </Link>
            </Button>
            <Button variant="destructive" className="w-full" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      </div>
    </div>
  );
}
