
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, X } from 'lucide-react';

export default function CartPage() {
  const cartItems = [
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">Shopping Cart</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="flex items-center p-4">
              <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
              </div>
              <div className="flex-grow">
                <Link href="/product" className="font-semibold hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 mx-4">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="number" value={item.quantity} className="w-12 h-8 text-center" readOnly />
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
              <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
