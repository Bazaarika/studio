
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Truck, ShoppingBag, PartyPopper, Pencil } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import type { Address } from "@/lib/firebase/firestore";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { address, saveAddress } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    if (address) {
      setShippingAddress(address);
    }
  }, [address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [id]: value }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50.00 : 0;
  const total = subtotal + shipping;
  
  const isAddressSaved = address && address.name && address.address && address.city && address.zip;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }
    
    // If the address form was filled out, save it first.
    if (!isAddressSaved) {
        const { name, address: street, city, zip, country } = shippingAddress;
        if (!name || !street || !city || !zip || !country) {
             toast({
                title: "Incomplete Address",
                description: "Please fill out all shipping address fields.",
                variant: "destructive",
            });
            return;
        }
        await saveAddress(shippingAddress);
    }
    
    // In a real app, you would process the payment here.
    // For this demo, we'll just simulate a successful order.
    
    clearCart();
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    router.push('/orders');
  };

  if (cart.length === 0) {
    return (
        <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
            <PartyPopper className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2 font-headline">Ready to Checkout?</h2>
            <p className="text-muted-foreground">Your cart is currently empty. Add some products to get started!</p>
            <Button asChild className="mt-6">
                <Link href="/categories">Browse Products</Link>
            </Button>
        </div>
    )
  }


  return (
    <div className="max-w-5xl mx-auto">
      <header className="text-center space-y-2 mb-10">
        <h1 className="text-4xl font-bold font-headline">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-headline">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Shipping Address
                </div>
                <Link href="/profile">
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
                {isAddressSaved ? (
                     <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">{address.name}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.zip}</p>
                        <p>{address.country}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={shippingAddress.name} onChange={handleAddressChange} placeholder="John Doe" />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={shippingAddress.address} onChange={handleAddressChange} placeholder="123 Main St" />
                        </div>
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="Anytown" />
                        </div>
                        <div>
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" value={shippingAddress.zip} onChange={handleAddressChange} placeholder="12345" />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={shippingAddress.country} onChange={handleAddressChange} placeholder="India" />
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <CreditCard className="h-5 w-5" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="card" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint}/>
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
