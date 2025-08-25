
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  ChevronRight,
  Clock,
  HelpCircle,
  FileText,
  LogOut,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  Loader2,
  Home,
  Check,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Address } from "@/lib/firebase/firestore";
import { useTheme, themes } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { messaging, VAPID_KEY } from "@/lib/firebase/config";
import { getToken, isSupported } from "firebase/messaging";
import { subscribeToTopic } from "@/lib/firebase/actions";


export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <ProfileView /> : <ProfileLoading />;
}

function ProfileLoading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}


function ProfileView() {
  const { user, address, loading, signOut, updateUserProfile, saveAddress } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
     if (user) {
        setDisplayName(user.displayName || '');
    }
    if (address) {
        setShippingAddress(address);
    }
  }, [user, address]);

  if (loading || !user) {
    return <ProfileLoading />;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return "U";
    return name.trim()[0].toUpperCase();
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateUserProfile({ displayName });
    setIsSubmitting(false);
    setIsProfileModalOpen(false);
  };
  
  const handleAddressUpdate = async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      await saveAddress(shippingAddress);
      setIsSubmitting(false);
      setIsAddressModalOpen(false);
  }

  const handleSubscription = async () => {
    setIsSubscribing(true);
    try {
        const isMessagingSupported = await isSupported();
        if (!messaging || !isMessagingSupported) {
            toast({ title: "Notifications Not Supported", description: "Your browser does not support push notifications.", variant: "destructive" });
            setIsSubscribing(false);
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            toast({ title: "Permission Denied", description: "You need to grant permission to receive notifications.", variant: "destructive" });
            setIsSubscribing(false);
            return;
        }

        if (!VAPID_KEY || VAPID_KEY === '...') {
             throw new Error("VAPID key is not configured. Please check your firebase/config.ts file and the README for instructions.");
        }

        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (currentToken) {
            await subscribeToTopic(currentToken, 'all');
            toast({ title: "Subscribed!", description: "You will now receive all notifications." });
        } else {
            throw new Error("Could not get registration token. This can happen if the FCM API is not enabled in your Google Cloud project.");
        }

    } catch (error: any) {
        console.error("Error during subscription:", error);
        toast({ 
            title: "Notification Registration Failed", 
            description: error.message || "Could not register for notifications. Please ensure the Firebase Cloud Messaging API is enabled in your Google Cloud project and your VAPID key is correct.", 
            variant: "destructive" 
        });
    } finally {
        setIsSubscribing(false);
    }
  }

  const accountSettings = [
    { icon: Clock, label: "Order History", href: "/orders" },
    { icon: ShoppingBag, label: "Shop Preference - Menswear", onClick: () => toast({ title: "Feature coming soon!" }) },
    { icon: UserIcon, label: "Account Details", onClick: () => setIsProfileModalOpen(true) },
    { icon: MapPin, label: "Manage Address", onClick: () => setIsAddressModalOpen(true) },
  ];

  const supportLinks = [
    { icon: Home, label: "Contact Us", onClick: () => toast({ title: "Feature coming soon!" }) },
    { icon: HelpCircle, label: "Help and Information", onClick: () => toast({ title: "Feature coming soon!" }) },
    { icon: ShieldCheck, label: "Privacy Policy", onClick: () => toast({ title: "Feature coming soon!" }) },
    { icon: FileText, label: "Terms & Conditions", onClick: () => toast({ title: "Feature coming soon!" }) },
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

      <Card>
        <CardContent className="pt-6">
            <div className="space-y-4 text-center">
                <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                <p className="text-2xl font-semibold font-headline">{user.displayName || "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                  <DialogTrigger asChild>
                     <Button variant="outline" className="rounded-full bg-secondary hover:bg-secondary/80 w-full max-w-xs mx-auto">
                        Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ACCOUNT SETTINGS</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
             <div className="px-6">
                {accountSettings.map((item) => (
                    <ProfileRow key={item.label} icon={item.icon} label={item.label} href={item.href} onClick={item.onClick} />
                ))}
             </div>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="text-lg">NOTIFICATION SETTINGS</CardTitle>
                <CardDescription>Manage how you receive notifications from us.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSubscription} disabled={isSubscribing} className="w-full">
                    {isSubscribing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Bell className="mr-2 h-4 w-4" />
                    )}
                    Subscribe to All Notifications
                </Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">THEME SETTINGS</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {themes.map((t) => (
                        <div key={t.name} className="flex flex-col items-center gap-2">
                            <button
                                onClick={() => setTheme(t.name)}
                                className={cn(
                                    "h-12 w-12 rounded-full border-2 flex items-center justify-center",
                                    theme === t.name ? "border-primary" : "border-muted"
                                )}
                                style={{ backgroundColor: `hsl(${t.colors.primary})` }}
                                aria-label={`Select ${t.name} theme`}
                            >
                                {theme === t.name && <Check className="h-6 w-6 text-primary-foreground" />}
                            </button>
                            <span className="text-xs font-medium text-muted-foreground">{t.label}</span>
                        </div>
                    ))}
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
                    <ProfileRow key={item.label} icon={item.icon} label={item.label} onClick={item.onClick} />
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-0">
                 <div className="px-6">
                     <ProfileRow icon={LogOut} label="Logout" onClick={signOut} isLogout/>
                 </div>
            </CardContent>
        </Card>
      </div>

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manage Shipping Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddressUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={shippingAddress.name} onChange={(e) => setShippingAddress(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={shippingAddress.address} onChange={(e) => setShippingAddress(p => ({...p, address: e.target.value}))} />
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={shippingAddress.city} onChange={(e) => setShippingAddress(p => ({...p, city: e.target.value}))} />
                    </div>
                    <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" value={shippingAddress.zip} onChange={(e) => setShippingAddress(p => ({...p, zip: e.target.value}))} />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={shippingAddress.country} onChange={(e) => setShippingAddress(p => ({...p, country: e.target.value}))} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Address'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
