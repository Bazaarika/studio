
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Truck, PartyPopper, Pencil, Loader2, Wallet, CheckCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useRef } from "react";
import type { Address } from "@/lib/firebase/firestore";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";


// Custom SwipeButton component
const SwipeButton = ({ onComplete, text }: { onComplete: () => void; text: string }) => {
  const x = useMotionValue(0);
  const [swiped, setSwiped] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const background = useTransform(x, [0, 200], ["hsl(var(--primary))", "hsl(var(--accent))"]);

  const handleDragEnd = () => {
    if (buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        const swipeThreshold = buttonWidth * 0.75;
        if (x.get() > swipeThreshold) {
            setSwiped(true);
            onComplete();
        } else {
            animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
        }
    }
  };

  return (
    <motion.div
      ref={buttonRef}
      className="relative w-full h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute left-0 top-0 h-full w-full bg-primary"
        style={{ width: x.get() + 56, background }} // 56px is handle width
      />
      <motion.div
        className="absolute left-1 top-1 h-12 w-12 rounded-full bg-background flex items-center justify-center z-10 cursor-grab"
        drag="x"
        dragConstraints={{ left: 0, right: buttonRef.current ? buttonRef.current.offsetWidth - 56 : 200 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ cursor: "grabbing" }}
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </motion.div>
      <span className="z-20 text-primary-foreground font-semibold text-lg pointer-events-none">
        {text}
      </span>
    </motion.div>
  );
};


export function CheckoutClient() {
  const { cart, clearCart } = useCart();
  const { user, address, loading: authLoading, saveAddress } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!authLoading && cart.length === 0) {
      router.push('/categories');
    }
  }, [authLoading, cart, router]);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    
    if (!address?.address) {
        toast({
            title: "No Address",
            description: "Please set a shipping address in your profile.",
            variant: "destructive",
        });
        setIsPlacingOrder(false);
        return;
    }

    // Simulate order placement
    setTimeout(() => {
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase.",
      });
      router.push('/orders');
    }, 1500);
  };
  
  if (authLoading || cart.length === 0) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  const formattedAddress = address ? [address.address, address.city, address.zip, address.country].filter(Boolean).join(', ') : '';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">Checkout</h1>
      </header>
      
      <div className="space-y-6">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary"/> 
                    Your delivery address
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href="/profile">
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Link>
                </Button>
           </CardHeader>
           <CardContent>
                {formattedAddress ? (
                     <p className="text-muted-foreground">{formattedAddress}</p>
                ) : (
                    <div className="text-center text-muted-foreground space-y-2">
                        <p>No shipping address found.</p>
                        <Button variant="outline" asChild>
                            <Link href="/profile">Add Address</Link>
                        </Button>
                    </div>
                )}
           </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary"/>
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <button onClick={() => setPaymentMethod('online')} className={cn("w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all", paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border')}>
                    <div className="flex items-center gap-3">
                        <Wallet className="h-6 w-6 text-primary"/>
                        <span className="font-semibold">Online Payment</span>
                    </div>
                    {paymentMethod === 'online' && <CheckCircle className="h-5 w-5 text-primary" />}
               </button>
               <button onClick={() => setPaymentMethod('cod')} className={cn("w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all", paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border')}>
                    <div className="flex items-center gap-3">
                        <Image src="https://bazaarika.in/wp-content/plugins/woocommerce-cod-advanced/images/cod.png" width={24} height={24} alt="COD"/>
                        <span className="font-semibold">Cash on Delivery (COD)</span>
                    </div>
                     {paymentMethod === 'cod' && <CheckCircle className="h-5 w-5 text-primary" />}
               </button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
             <CardContent className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>

        <div>
            {isPlacingOrder ? (
                 <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-semibold">Placing Order...</span>
                 </div>
            ) : (
                <SwipeButton 
                    onComplete={handlePlaceOrder}
                    text={paymentMethod === 'online' ? 'Swipe to Pay' : 'Swipe to Confirm'}
                />
            )}
        </div>
      </div>
    </div>
  );
}
