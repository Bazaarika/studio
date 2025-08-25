
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const { cart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
        <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 font-headline">Your cart is empty</h2>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
                <Link href="/categories">Continue Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[1fr_350px] gap-8 items-start">
      <div className="space-y-6">
          <header className="text-left">
            <h1 className="text-3xl font-bold font-headline">My Cart ({cart.length})</h1>
          </header>
          <Card>
            <CardContent className="p-0 divide-y">
                {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 border">
                        <Image 
                            src={item.images?.[0]?.url || 'https://placehold.co/100x100.png'} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                            data-ai-hint={item.images?.[0]?.hint} 
                        />
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
                        <div>
                            <Link href={`/product/${item.id}`} className="font-semibold text-lg hover:text-primary">{item.name}</Link>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="font-bold text-primary mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-4 text-center font-semibold">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                </div>
                ))}
            </CardContent>
          </Card>
      </div>
      
      <div className="sticky top-24">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-between text-muted-foreground">
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
                <Button size="lg" className="w-full bg-accent text-accent-foreground rounded-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
