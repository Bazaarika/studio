
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle, Truck } from "lucide-react";
import { notFound } from "next/navigation";

export default function TrackOrderPage({ params }: { params: { id: string } }) {
    const order = orders.find(o => o.id === params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold font-headline">Track Order</h1>
                <p className="text-muted-foreground">Order ID: {order.id}</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Truck className="h-6 w-6 text-primary"/>
                        Tracking History
                    </CardTitle>
                    <CardDescription>
                        Current Status: <span className="font-semibold text-primary">{order.status}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                         {/* Timeline line */}
                        <div className="absolute left-[35px] top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
                        
                        <ul className="space-y-8">
                           {order.trackingHistory.map((history, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className={cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-background z-10", 
                                        index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                       <CheckCircle className="h-5 w-5"/>
                                    </div>
                                    <div className="flex-grow pt-1.5">
                                        <p className="font-semibold">{history.status}</p>
                                        <p className="text-sm text-muted-foreground">{history.location}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{history.date}</p>
                                    </div>
                                </li>
                           ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
