
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Edit, LogOut, MapPin, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" defaultValue={user.displayName?.split(' ')[0] || ''} />
                        </div>
                        <div>
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue={user.displayName?.split(' ').slice(1).join(' ') || ''} />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} readOnly/>
                    </div>
                    <Button>Save Changes</Button>
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
