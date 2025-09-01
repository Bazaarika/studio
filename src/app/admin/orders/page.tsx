
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, Calendar as CalendarIcon, RefreshCw, Search, Printer } from "lucide-react";
import Link from "next/link";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Order } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";

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
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    const { toast } = useToast();
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const fetchedOrders = await getAllOrders();
            setAllOrders(fetchedOrders);
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

    const filteredOrders = useMemo(() => {
        return allOrders
            .filter(order => {
                if (activeTab === "All") return true;
                // Add more statuses here if they exist in your data
                const tabStatusMap: { [key: string]: string } = {
                    "Pending": "Processing",
                    "Confirmed": "Shipped",
                    "Shipped": "Shipped",
                    "Closed": "Delivered"
                };
                return order.status === tabStatusMap[activeTab];
            })
            .filter(order => {
                return order.id.toLowerCase().includes(searchQuery.toLowerCase());
            });
    }, [allOrders, activeTab, searchQuery]);

    const statusCounts = useMemo(() => {
        const counts = {
            "Pending": 0,
            "Confirmed": 0,
            "Shipped": 0,
            "Closed": 0,
        };
        allOrders.forEach(order => {
            if (order.status === 'Processing') counts.Pending++;
            if (order.status === 'Shipped') counts.Confirmed++; // Assuming confirmed means shipped for now
            if (order.status === 'Shipped') counts.Shipped++;
            if (order.status === 'Delivered') counts.Closed++;
        });
        return counts;
    }, [allOrders]);
    
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

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOrderIds(filteredOrders.map(order => order.id));
        } else {
            setSelectedOrderIds([]);
        }
    };

    const handleSelectOrder = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedOrderIds(prev => [...prev, orderId]);
        } else {
            setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        }
    };

    const handlePrintSelected = () => {
        if (selectedOrderIds.length > 0) {
            const query = selectedOrderIds.join(',');
            window.open(`/admin/orders/print-labels?ids=${query}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold">Manage Orders</h1>
                <p className="text-muted-foreground">Manage all your orders from here.</p>
            </div>
            <Card>
                <CardHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Pending">Pending <Badge className="ml-2">{statusCounts.Pending}</Badge></TabsTrigger>
                            <TabsTrigger value="Confirmed">Confirmed <Badge className="ml-2">{statusCounts.Confirmed}</Badge></TabsTrigger>
                            <TabsTrigger value="Shipped">Shipped <Badge className="ml-2">{statusCounts.Shipped}</Badge></TabsTrigger>
                            <TabsTrigger value="Closed">Closed <Badge className="ml-2">{statusCounts.Closed}</Badge></TabsTrigger>
                            <TabsTrigger value="Failed">Failed to sync <Badge className="ml-2">0</Badge></TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className="w-[300px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                         <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cod">COD</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Reset</Button>
                        <Button>Apply</Button>
                         <Button variant="ghost" size="icon" onClick={fetchOrders} disabled={loading}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search Order ID..."
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedOrderIds.length > 0 && (
                        <div className="mb-4">
                            <Button onClick={handlePrintSelected}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Selected ({selectedOrderIds.length})
                            </Button>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-12">
                                     <Checkbox
                                        checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                    />
                                </TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Product Details</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Order Status</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedOrderIds.includes(order.id)}
                                            onCheckedChange={(checked) => handleSelectOrder(order.id, Boolean(checked))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-primary">#{order.id.substring(0, 7)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={order.items[0]?.imageUrl || 'https://placehold.co/64x64.png'}
                                                alt={order.items[0]?.name || 'Product Image'}
                                                width={48}
                                                height={48}
                                                className="aspect-square rounded-md object-cover"
                                            />
                                            <div>
                                                <div className="font-medium hover:text-primary cursor-pointer">{order.items[0].name}</div>
                                                <div className="text-xs text-muted-foreground">SKU: {order.items[0].id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                     <TableCell>
                                        <div className="font-medium">SP: ₹{order.total.toFixed(2)}</div>
                                        <Badge variant="secondary">{order.paymentMethod.toUpperCase()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                         <div className="text-xs text-muted-foreground mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.shippingAddress.name}</div>
                                        <div className="text-xs text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.country}</div>
                                        <Link href={`/admin/orders/${order.id}`} className="text-xs text-blue-600 hover:underline">View Details</Link>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-16 p-0">Actions</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                 <DropdownMenuItem onSelect={() => window.open(`/admin/orders/${order.id}/label`, '_blank')}>
                                                    Print Label
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Cancel</DropdownMenuItem>
                                                <DropdownMenuItem>Confirm</DropdownMenuItem>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button variant="outline" size="sm">Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

    