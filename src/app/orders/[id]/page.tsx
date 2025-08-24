
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orders } from "@/lib/mock-data";
import { CreditCard, Home, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = orders.find(o => o.id === params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Order Details</h1>
        <p className="text-muted-foreground">Order ID: {order.id}</p>
        <div className="mt-2 text-sm text-muted-foreground">
            <span>Placed on {order.date}</span> | <span className="font-semibold text-primary">{order.status}</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Package className="h-5 w-5"/>
                        Order Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint}/>
                                    </div>
                                    <div>
                                    <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
           </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Truck className="h-5 w-5"/>
                        Shipping Information
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="font-medium">John Doe</p>
                    <p className="text-muted-foreground">{order.shippingAddress}</p>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">
                        Total Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹0.00</span>
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                       <CreditCard className="h-5 w-5"/>
                        Payment Information
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{order.paymentMethod}</p>
                </CardContent>
            </Card>
            <Button className="w-full" variant="outline" asChild>
                <Link href={`/track-order/${order.id}`}>Track Your Order</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
