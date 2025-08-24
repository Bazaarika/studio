
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/mock-data";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const orders = [
  {
    id: "ORD001",
    date: "June 23, 2024",
    status: "Delivered",
    total: 249.98,
    items: [
      { ...products[1], quantity: 1 },
      { ...products[2], quantity: 1 },
    ],
  },
  {
    id: "ORD002",
    date: "June 25, 2024",
    status: "Shipped",
    total: 79.99,
    items: [{ ...products[0], quantity: 1 }],
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">My Orders</h1>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline">Order {order.id}</CardTitle>
                <CardDescription>Date: {order.date}</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-semibold">Status: {order.status}</p>
                <p className="text-muted-foreground">Total: ₹{order.total.toFixed(2)}</p>
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
                    <Link href="/product" className="font-semibold hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline">Track Order</Button>
              <Button>View Details</Button>
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
