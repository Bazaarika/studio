
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Order } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Timestamp } from "firebase/firestore";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

async function getAllOrders(): Promise<Order[]> {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
        
        orders.push({
            id: doc.id,
            ...data,
            createdAt,
        } as Order);
    });
    return orders;
}


export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const { toast } = useToast();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const fetchedOrders = await getAllOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast({
                title: "Error",
                description: "Failed to fetch orders.",
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedOrderIds(orders.map(order => order.id));
        } else {
            setSelectedOrderIds([]);
        }
    };
    
    const handleSelectRow = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedOrderIds(prev => [...prev, orderId]);
        } else {
            setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        }
    };

    const handlePrintSelected = () => {
        const orderIds = selectedOrderIds.join(',');
        window.open(`/admin/orders/print-labels?ids=${orderIds}`, '_blank');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'default';
            case 'Shipped':
                return 'secondary';
            case 'Processing':
                return 'outline';
            default:
                return 'secondary';
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>
                                A list of all the orders placed in your store.
                            </CardDescription>
                        </div>
                        {selectedOrderIds.length > 0 && (
                            <Button onClick={handlePrintSelected}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Selected ({selectedOrderIds.length})
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedOrderIds.length > 0 && selectedOrderIds.length === orders.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-16">
                                     <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                <TableRow key={order.id} data-state={selectedOrderIds.includes(order.id) ? "selected" : undefined}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedOrderIds.includes(order.id)}
                                            onCheckedChange={(checked) => handleSelectRow(order.id, !!checked)}
                                        />
                                    </TableCell>
                                     <TableCell>
                                        <Image
                                            src={order.items[0]?.imageUrl || 'https://placehold.co/64x64.png'}
                                            alt={order.items[0]?.name || 'Product Image'}
                                            width={48}
                                            height={48}
                                            className="aspect-square rounded-md object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                                    <TableCell>{order.shippingAddress.name}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">&#8377;{order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/orders/${order.id}`} target="_blank">View Details</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/orders/${order.id}/label`} target="_blank">Print Label</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
