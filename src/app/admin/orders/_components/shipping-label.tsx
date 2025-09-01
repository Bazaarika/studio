
'use client';

import type { Order } from '@/lib/mock-data';
import { Barcode } from 'lucide-react';

interface ShippingLabelProps {
    order: Order;
}

// A simple mock barcode generator for visual effect
const MockBarcode = ({ text }: { text: string }) => {
    const bars = text.split('').map((char, i) => {
        const width = (char.charCodeAt(0) % 8) + 1; // Width between 1 and 8
        return <div key={i} className={`h-12 bg-black`} style={{ width: `${width}px` }}></div>;
    });
    return <div className="flex items-end gap-px">{bars}</div>;
};


export function ShippingLabel({ order }: ShippingLabelProps) {
    const isPrepaid = order.paymentMethod.toLowerCase() === 'online';

    return (
        <div className="bg-white text-black p-6 border-2 border-black border-dashed w-full max-w-lg mx-auto font-sans">
            <header className="flex justify-between items-center pb-4 border-b border-black">
                <div>
                    <h1 className="text-2xl font-bold">Bazaarika</h1>
                    <p className="text-sm">Your modern e-commerce experience.</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{isPrepaid ? "PREPAID" : "COD"}</p>
                    {!isPrepaid && <p className="font-bold text-xl">Amount: ₹{order.total.toFixed(2)}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 py-4 border-b border-black">
                <div>
                    <p className="text-xs font-bold uppercase">SHIP FROM:</p>
                    <p className="font-semibold">Bazaarika Warehouse</p>
                    <p>123 Fashion Street</p>
                    <p>Mumbai, 400001</p>
                    <p>Maharashtra, India</p>
                </div>
                 <div>
                    <p className="text-xs font-bold uppercase">SHIP TO:</p>
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            </section>

            <footer className="pt-4 text-center">
                 <p className="text-sm font-semibold">Order ID: #{order.id.substring(0, 7)}</p>
                 <div className="flex justify-center items-center mt-2">
                    <MockBarcode text={order.id} />
                 </div>
            </footer>
        </div>
    );
}
