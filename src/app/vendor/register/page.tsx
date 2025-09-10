
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Building, User, Mail, Phone, Lock, Hash, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function VendorRegisterPage() {
    const { registerVendor } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        shopName: '',
        contactName: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        gstNumber: '',
        panNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await registerVendor(formData);
            toast({
                title: "Registration Submitted!",
                description: "Your application has been received. You will be notified once it's approved.",
            });
            router.push('/vendor/register/success');
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Could not complete registration. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
             <div className="flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-headline">
                           Become a Seller on Bazaarika
                        </h1>
                        <p className="text-muted-foreground">
                            Join our marketplace and reach millions of customers.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="shopName">Shop Name</Label>
                                <Input id="shopName" value={formData.shopName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="contactName">Contact Name</Label>
                                <Input id="contactName" value={formData.contactName} onChange={handleChange} required />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Textarea id="address" value={formData.address} onChange={handleChange} required />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="gstNumber">GST Number</Label>
                                <Input id="gstNumber" value={formData.gstNumber} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="panNumber">PAN Number</Label>
                                <Input id="panNumber" value={formData.panNumber} onChange={handleChange} required />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Register as Seller'}
                        </Button>
                    </form>

                     <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline focus:outline-none">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
             <div className="relative hidden lg:block">
                <Image 
                    src="https://picsum.photos/seed/vendor/800/1200" 
                    alt="Vendor working" 
                    fill 
                    className="object-cover"
                    data-ai-hint="vendor working"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 text-white">
                    <h2 className="text-4xl font-bold font-headline">Grow Your Business</h2>
                    <p className="max-w-md mt-2 text-lg">Partner with Bazaarika to showcase your products to a wider audience and boost your sales.</p>
                 </div>
            </div>
        </div>
    );
}
