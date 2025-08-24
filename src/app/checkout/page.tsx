
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutClient } from "@/components/checkout-client";

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <CheckoutClient />;
}
