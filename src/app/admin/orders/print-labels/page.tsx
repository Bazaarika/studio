
'use client';

import { Suspense, useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Order } from '@/lib/mock-data';
import { Loader2, Printer } from 'lucide-react';
import { useSearchParams, notFound } from 'next/navigation';
import { ShippingLabel } from '../_components/shipping-label';
import { Button } from '@/components/ui/button';

async function getOrdersByIds(ids: string[]): Promise<Order[]> {
    const orderPromises = ids.map(id => getDoc(doc(db, 'orders', id)));
    const orderSnapshots = await Promise.all(orderPromises);
    
    const orders: Order[] = [];
    orderSnapshots.forEach(snapshot => {
        if (snapshot.exists()) {
            orders.push({ id: snapshot.id, ...snapshot.data() } as Order);
        }
    });
    return orders;
}

function PrintLabelsContent() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const orderIds = searchParams.get('ids')?.split(',') || [];

    useEffect(() => {
        if (orderIds.length === 0) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrdersByIds(orderIds);
                setOrders(fetchedOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [searchParams]); // Rerun when searchParams change

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (orders.length === 0) {
        notFound();
    }

    return (
        <div className="bg-muted min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-lg mb-4">
                <Button onClick={() => window.print()} className="w-full print:hidden">
                    <Printer className="mr-2 h-4 w-4" />
                    Print All Labels
                </Button>
            </div>
            <div className="w-full space-y-4">
                 {orders.map((order, index) => (
                    <div key={order.id} className="printable-label-wrapper">
                        <ShippingLabel order={order} />
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @media print {
                    .printable-label-wrapper {
                        page-break-after: always;
                    }
                    .printable-label-wrapper:last-child {
                        page-break-after: auto;
                    }
                }
            `}</style>
        </div>
    );
}

export default function PrintMultipleLabelsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PrintLabelsContent />
        </Suspense>
    )
}
