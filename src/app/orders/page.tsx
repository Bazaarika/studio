
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/mock-data";
import { Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserOrders } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const userOrders = await getUserOrders(user!.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, [user, authLoading, router]);
  
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">My Orders</h1>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <CardTitle className="font-headline text-lg md:text-xl">Order #{order.id.substring(0, 7)}</CardTitle>
                <CardDescription>Date: {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <div className="text-left md:text-right mt-2 md:mt-0">
                <p className="font-semibold">Status: <span className="text-primary">{order.status}</span></p>
                <p className="text-muted-foreground">Total: &#8377;{order.total.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint}/>
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium">&#8377;{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" asChild>
                <Link href={`/track-order/${order.id}`}>Track Order</Link>
              </Button>
              <Button asChild>
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
         {orders.length === 0 && (
            <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground">Looks like you haven't placed any orders.</p>
                <Button asChild className="mt-4">
                    <Link href="/categories">Start Shopping</Link>
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
