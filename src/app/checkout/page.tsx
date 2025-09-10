
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutClient } from '@/components/checkout-client';
import { getProduct } from "@/lib/firebase/firestore";
import type { CartItem } from "@/hooks/use-cart";
import { notFound } from "next/navigation";

// This is now a Server Component responsible for initial data fetching
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  const isBuyNow = searchParams.buyNow === 'true';
  const productId = typeof searchParams.productId === 'string' ? searchParams.productId : undefined;
  const quantity = typeof searchParams.quantity === 'string' ? parseInt(searchParams.quantity, 10) : 1;

  let initialItems: CartItem[] = [];

  // If it's a "Buy Now" action, fetch the product server-side
  if (isBuyNow && productId) {
    const product = await getProduct(productId);
    if (product) {
      initialItems = [{ ...product, quantity }];
    } else {
        // If the product isn't found, show a 404 page
        notFound();
    }
  }

  return (
    <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Preparing your checkout...</p>
        </div>
    }>
      {/* 
        The CheckoutClient now receives the initial items. 
        If it's not a 'buy now' action, it will get the items from the cart context on the client-side.
      */}
      <CheckoutClient initialItems={initialItems} isBuyNow={isBuyNow} />
    </Suspense>
  )
}
