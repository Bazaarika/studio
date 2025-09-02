
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, UserPlus, Search } from "lucide-react";
import { getCustomers, type Customer } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const fetchedCustomers = await getCustomers();
                setCustomers(fetchedCustomers);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch customer data.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [toast]);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery) {
            return customers;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return customers.filter(customer =>
            customer.name?.toLowerCase().includes(lowercasedQuery) ||
            customer.email?.toLowerCase().includes(lowercasedQuery)
        );
    }, [customers, searchQuery]);

    const getInitials = (name: string | null | undefined) => {
        if (!name || name.trim() === '') return "U";
        return name.trim().split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Customers</h1>
                    <p className="text-muted-foreground">Manage your customers and view their details.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => toast({ title: "Feature coming soon!"})}>
                        <UserPlus className="mr-2 h-4 w-4" /> Add Customer
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                                <TableHead className="hidden md:table-cell">Total Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={customer.photoURL || ''} alt={customer.name || 'User'} />
                                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{customer.name || 'N/A'}</div>
                                                    <div className="text-sm text-muted-foreground">{customer.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{customer.phone || 'N/A'}</TableCell>
                                        <TableCell className="hidden md:table-cell text-center">{customer.totalOrders}</TableCell>
                                        <TableCell>₹{customer.totalSpent.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon!"})}>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon!"})}>View Orders</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
