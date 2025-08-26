
'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getOrder } from "@/lib/firebase/firestore";
import type { Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
    const params = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const orderId = params.id as string;

    useEffect(() => {
        if (!orderId || !user) return;

        async function fetchOrder() {
            try {
                const fetchedOrder = await getOrder(orderId);
                if (fetchedOrder && fetchedOrder.userId === user.uid) {
                    setOrder(fetchedOrder);
                } else {
                    setOrder(null);
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchOrder();
    }, [orderId, user]);

    if (loading) {
        // You might want a better loading skeleton here
        return <div className="text-center p-10">Loading...</div>;
    }

    if (!order) {
        return notFound();
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
             <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="relative h-24 w-24 mb-6"
             >
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30"></div>
                <div className={cn(
                    "relative h-24 w-24 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-primary/10 via-secondary to-secondary border-2 border-primary/20"
                )}>
                    <Check className="h-12 w-12 text-primary" />
                </div>
            </motion.div>

            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold font-headline mb-2"
            >
                Order Placed Successfully!
            </motion.h1>

            <motion.p 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                className="text-muted-foreground mb-6"
            >
                Thank you for your purchase. Your order is being processed.
            </motion.p>

             <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.6 }}
                className="bg-secondary p-4 rounded-lg mb-8"
            >
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold text-primary">#{order.id.substring(0, 7)}</p>
            </motion.div>

            <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Button asChild variant="outline" size="lg">
                    <Link href={`/track-order/${order.id}`}>
                        <Truck className="mr-2 h-5 w-5"/>
                        Track Your Order
                    </Link>
                </Button>
                <Button asChild size="lg">
                     <Link href="/categories">
                        <ShoppingBag className="mr-2 h-5 w-5"/>
                        Continue Shopping
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}

    