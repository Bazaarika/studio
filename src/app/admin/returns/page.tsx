
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, RefreshCw, Search, Box } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

// This is a placeholder component as we don't have return data yet.
// It fully implements the UI from the screenshot.

export default function ManageReturnsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold">Manage Returns</h1>
                <p className="text-muted-foreground">Manage all your returns from here.</p>
            </div>
            <Card>
                <CardContent className="pt-6">
                     <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Pending">Pending</TabsTrigger>
                            <TabsTrigger value="Approved">Approved</TabsTrigger>
                            <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                            <TabsTrigger value="Picked Up">Picked Up</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className="w-auto sm:w-[260px] justify-start text-left font-normal"
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
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">Reset</Button>
                        <Button>Apply</Button>
                         <Button variant="ghost" size="icon">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Order ID"
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                            />
                        </div>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Return ID</TableHead>
                                <TableHead>Product Details</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Return Reason</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <div className="flex flex-col items-center justify-center text-center p-12">
                                        <Box className="h-16 w-16 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">No data</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
