
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  ChevronRight,
  Clock,
  HelpCircle,
  FileText,
  LogOut,
  Mail,
  MapPin,
  Bell,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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
  };

  const accountSettings = [
    { icon: Clock, label: "Order History", href: "/orders" },
    { icon: ShoppingBag, label: "Shop Preference - Menswear", href: "#" },
    { icon: UserIcon, label: "Account Details", href: "#" },
    { icon: Bell, label: "Notification", href: "#" },
    { icon: Mail, label: "Email", href: "#" },
    { icon: MapPin, label: "Location Services", href: "#" },
  ];

  const supportLinks = [
    { icon: Phone, label: "Contact Us", href: "#" },
    { icon: HelpCircle, label: "Help and Information", href: "#" },
    { icon: ShieldCheck, label: "Privacy Policy", href: "#" },
    { icon: FileText, label: "Terms & Conditions", href: "#" },
  ];

  const ProfileRow = ({ icon: Icon, label, href, onClick, isLogout = false }: { icon: React.ElementType, label: string, href?: string, onClick?: () => void, isLogout?: boolean }) => {
    const content = (
       <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className={`text-base ${isLogout ? 'text-destructive' : 'text-foreground'}`}>{label}</span>
        </div>
        {!isLogout && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </div>
    );

    const Wrapper = href ? Link : 'button';
    const props = href ? { href } : { onClick, className: "w-full text-left" };

    // @ts-ignore
    return <Wrapper {...props}>{content}</Wrapper>;
  }


  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold font-headline">Profile</h1>
      </header>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-lg font-semibold">{user.displayName || "User"}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" className="rounded-full bg-secondary hover:bg-secondary/80">
          Edit Profile
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ACCOUNT SETTINGS</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
             <div className="px-6">
                {accountSettings.map((item) => (
                    <ProfileRow key={item.label} icon={item.icon} label={item.label} href={item.href} />
                ))}
             </div>
             <div className="px-6">
                 <ProfileRow icon={LogOut} label="Logout" onClick={signOut} isLogout/>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SUPPORT</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            <div className="px-6">
                {supportLinks.map((item) => (
                    <ProfileRow key={item.label} icon={item.icon} label={item.label} href={item.href} />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
