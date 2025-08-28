
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Truck, Pencil, Loader2, Wallet, CheckCircle, ChevronRight, Banknote } from "lucide-react";
import Image from "next/image";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { getProduct, placeOrder } from "@/lib/firebase/firestore";
import type { OrderItem } from "@/lib/mock-data";

// Extend window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Custom SwipeButton component
const SwipeButton = ({ onComplete, text }: { onComplete: () => void; text: string }) => {
  const x = useMotionValue(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const background = useTransform(
    x,
    [0, buttonWidth > 0 ? buttonWidth - 56 : 200],
    ["hsl(var(--primary))", "hsl(var(--accent))"]
  );
  
  const handleDragEnd = () => {
      if (buttonWidth > 0) {
        const swipeThreshold = buttonWidth * 0.75;
        if (x.get() > swipeThreshold) {
            setIsCompleted(true);
            onComplete();
        } else {
            animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
        }
    }
  };

  const dragConstraints = { 
    left: 0, 
    right: buttonWidth > 0 ? buttonWidth - 56 : 0 
  };


  return (
    <div
      ref={buttonRef}
      className="relative w-full h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute left-0 top-0 h-full bg-primary"
        style={{ width: x, background }}
      />
      <motion.div
        className="absolute left-1 top-1 h-12 w-12 rounded-full bg-background flex items-center justify-center z-10 cursor-grab"
        drag={!isCompleted ? "x" : false}
        dragConstraints={dragConstraints}
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
    </div>
  );
};


export function CheckoutClient() {
  const { cart: mainCart, clearCart } = useCart();
  const { user, address, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod' | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const isBuyNow = searchParams.get('buyNow') === 'true';
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  useEffect(() => {
    async function prepareCheckoutItems() {
        setLoadingItems(true);
        if (isBuyNow && productId) {
            try {
                const product = await getProduct(productId);
                if (product) {
                    setCheckoutItems([{...product, quantity: quantity}]);
                } else {
                    toast({ title: "Product not found", description: "The item you tried to buy is no longer available.", variant: "destructive"});
                    router.push('/');
                }
            } catch (error) {
                 toast({ title: "Error", description: "Could not fetch product details.", variant: "destructive"});
                 router.push('/');
            }
        } else {
            setCheckoutItems(mainCart);
        }
        setLoadingItems(false);
    }
    prepareCheckoutItems();
  }, [isBuyNow, productId, quantity, mainCart, router, toast]);


  useEffect(() => {
    if (!loadingItems && !isBuyNow && checkoutItems.length === 0) {
      toast({
          title: "Your cart is empty",
          description: "Add some items to checkout.",
      })
      router.push('/categories');
    }
  }, [loadingItems, checkoutItems, router, toast, isBuyNow]);

    const placeOrderInDb = async (paymentId?: string) => {
        if (!user || !address?.address || !paymentMethod) return;

        const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 50.00 : 0;
        const total = subtotal + shipping;

        const orderItems: OrderItem[] = checkoutItems.map(item => ({
            id: item.id!,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: (item.images && item.images.length > 0 && item.images[0].url) ? item.images[0].url : "https://placehold.co/100x100.png",
            aiHint: (item.images && item.images.length > 0 && item.images[0].hint) ? item.images[0].hint : "",
        }));

        try {
            const orderId = await placeOrder(user.uid, orderItems, total, address, paymentMethod, paymentId);
            
            if (!isBuyNow) {
                clearCart();
            }
            
            // Redirect to the new order success page
            router.push(`/order-success/${orderId}`);

        } catch (error) {
            console.error("Failed to place order:", error);
            toast({ title: "Order Failed", description: "There was an issue placing your order. Please try again.", variant: "destructive" });
        } finally {
             setIsPlacingOrder(false);
        }
    }

    const handleCodOrder = () => {
        setIsPlacingOrder(true);
        if (!user) {
            toast({ title: "Please login", description: "You need to be logged in to place an order.", variant: "destructive" });
            router.push('/login');
            setIsPlacingOrder(false);
            return;
        }
        if (!address?.address) {
            toast({ title: "No Address", description: "Please set a shipping address in your profile.", variant: "destructive" });
            router.push('/profile');
            setIsPlacingOrder(false);
            return;
        }
        placeOrderInDb("COD");
    };

    const handleOnlinePayment = () => {
        setIsPlacingOrder(true);
        if (!user) {
            toast({ title: "Please login", description: "You need to be logged in to place an order.", variant: "destructive" });
            router.push('/login');
            setIsPlacingOrder(false);
            return;
        }
        if (!address?.address) {
            toast({ title: "No Address", description: "Please set a shipping address in your profile.", variant: "destructive" });
            router.push('/profile');
            setIsPlacingOrder(false);
            return;
        }

        const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 50.00 : 0;
        const total = subtotal + shipping;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100, // Amount in paise
            currency: "INR",
            name: "Bazaarika",
            description: "E-commerce Transaction",
            image: "https://bazaarika.in/wp-content/uploads/2024/04/bazaarika-favicon.webp",
            handler: function (response: any) {
                placeOrderInDb(response.razorpay_payment_id);
            },
            prefill: {
                name: user.displayName || 'Bazaarika User',
                email: user.email || '',
                contact: ''
            },
            notes: {
                address: [address.address, address.city, address.zip, address.country].filter(Boolean).join(', ')
            },
            theme: {
                color: "#A020F0" // Purple theme color for Razorpay modal
            },
            modal: {
                ondismiss: function() {
                    setIsPlacingOrder(false);
                    toast({ title: "Payment Canceled", description: "You can try again anytime.", variant: "destructive"});
                }
            }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                console.error("Razorpay payment failed:", response.error);
                toast({
                    title: "Payment Failed",
                    description: response.error.description || "An error occurred during payment.",
                    variant: "destructive"
                });
                setIsPlacingOrder(false);
            });
            rzp.open();
        } catch (error) {
            console.error("Razorpay Error:", error);
            toast({
                title: "Payment Error",
                description: "Could not initialize online payment. Please try again.",
                variant: "destructive"
            });
            setIsPlacingOrder(false);
        }
    };
  
  if (authLoading || loadingItems) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  const formattedAddress = address ? [address.address, address.city, address.zip, address.country].filter(Boolean).join(', ') : '';

  const handleSwipeComplete = () => {
    if (paymentMethod === 'online') {
        handleOnlinePayment();
    } else if (paymentMethod === 'cod') {
        handleCodOrder();
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-24">
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
                        <Banknote className="h-6 w-6 text-primary"/>
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
             <CardContent className="space-y-4">
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                   {checkoutItems.map((item) => {
                       const imageUrl = (item.images && item.images.length > 0 && item.images[0].url) 
                           ? item.images[0].url 
                           : "https://placehold.co/100x100.png";
                       return (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                                    <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">&#8377;{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                       );
                   })}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>&#8377;{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>&#8377;{shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2"/>
                  <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>&#8377;{total.toFixed(2)}</span>
                  </div>
                </div>
            </CardContent>
        </Card>
      </div>

       <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl py-4">
                {isPlacingOrder ? (
                    <div className="flex justify-center items-center gap-2 h-14">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-lg font-semibold">Placing Order...</span>
                    </div>
                ) : paymentMethod && formattedAddress ? (
                    <SwipeButton 
                        onComplete={handleSwipeComplete}
                        text={paymentMethod === 'online' ? 'Swipe to Pay' : 'Swipe to Confirm'}
                    />
                ) : (
                    <div className="text-center text-muted-foreground font-medium h-14 flex items-center justify-center">
                       { !formattedAddress ? "Please add a shipping address" : "Please select a payment method" }
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
