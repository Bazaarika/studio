
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
  MapPin,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  Loader2,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Address } from "@/lib/firebase/firestore";

export default function ProfilePage() {
  const { user, address, loading, signOut, updateUserProfile, saveAddress } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
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
    if (user) {
        setDisplayName(user.displayName || '');
    }
    if (address) {
        setShippingAddress(address);
    }
  }, [user, loading, router, address]);

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
