
"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load the CheckoutClient component
const CheckoutClient = lazy(() =>
  import('@/components/checkout-client').then(module => ({ default: module.CheckoutClient }))
);

function CheckoutPageContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Checkout...</p>
      </div>
    );
  }

  return <CheckoutClient />;
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-2 text-muted-foreground">Preparing your checkout...</p>
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    )
}
