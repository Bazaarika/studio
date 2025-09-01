
'use client';

import { useEffect, useState } from 'react';
import { getOrder } from '@/lib/firebase/firestore';
import type { Order } from '@/lib/mock-data';
import { Loader2, Printer } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import { ShippingLabel } from '../../_components/shipping-label';
import { Button } from '@/components/ui/button';

export default function PrintLabelPage() {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const orderId = params.id as string;

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const fetchedOrder = await getOrder(orderId);
                setOrder(fetchedOrder);
            } catch (err) {
                console.error("Failed to fetch order:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        notFound();
    }

    return (
        <div className="bg-muted min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-lg mb-4">
                <Button onClick={() => window.print()} className="w-full print:hidden">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Label
                </Button>
            </div>
            <ShippingLabel order={order} />
        </div>
    );
}
