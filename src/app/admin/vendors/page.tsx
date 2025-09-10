
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Check, X } from "lucide-react";
import { getVendorApplications, approveVendor, type VendorApplication } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendVendorApprovalEmail } from "@/lib/firebase/actions";

export default function VendorsPage() {
    const [applications, setApplications] = useState<VendorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Pending");
    const { toast } = useToast();

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const fetchedApplications = await getVendorApplications();
            setApplications(fetchedApplications);
        } catch (error) {
            console.error("Failed to fetch vendor applications:", error);
            toast({
                title: "Error",
                description: "Failed to fetch vendor data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleApprove = async (userId: string, email: string) => {
        try {
            await approveVendor(userId);
            await sendVendorApprovalEmail(email); // Send email notification
            toast({
                title: "Vendor Approved",
                description: "The vendor's account has been activated and an email has been sent.",
            });
            fetchApplications(); // Refresh the list
        } catch (error) {
            console.error("Failed to approve vendor:", error);
            toast({
                title: "Error",
                description: "Could not approve the vendor application.",
                variant: "destructive",
            });
        }
    };

    const filteredApplications = useMemo(() => {
        return applications
            .filter(app => {
                if (activeTab === 'All') return true;
                return app.status.toLowerCase() === activeTab.toLowerCase();
            })
            .filter(app =>
                app.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [applications, searchQuery, activeTab]);

    const statusVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    }

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
                    <h1 className="text-2xl font-bold">Vendor Applications</h1>
                    <p className="text-muted-foreground">Review and approve new vendor registrations.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by shop or email..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <Card>
                <CardHeader>
                     <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="Pending">Pending</TabsTrigger>
                            <TabsTrigger value="Approved">Approved</TabsTrigger>
                            <TabsTrigger value="All">All</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shop Name</TableHead>
                                <TableHead>Contact Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map(app => (
                                    <TableRow key={app.uid}>
                                        <TableCell className="font-medium">{app.shopName}</TableCell>
                                        <TableCell>{app.email}</TableCell>
                                        <TableCell>{app.phone}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(app.status)} className="capitalize">
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {app.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleApprove(app.uid, app.email)}>
                                                        <Check className="mr-2 h-4 w-4" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => toast({ title: "Feature coming soon!" })}>
                                                        <X className="mr-2 h-4 w-4" /> Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No applications found.
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
