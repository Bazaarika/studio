
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VendorRegistrationSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
             <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />

            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                Application Submitted!
            </h1>

            <p className="text-muted-foreground mb-6 max-w-md">
                Thank you for registering. Your application is now under review. You will receive an email notification once your account has been approved by our team.
            </p>

            <Button asChild size="lg">
                 <Link href="/">
                    Go to Homepage
                </Link>
            </Button>
        </div>
    );
}
