
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight } from "lucide-react";

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: "Added to cart!",
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleBuyNow = () => {
        addToCart(product);
        router.push('/checkout');
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 h-24 md:h-auto md:py-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold font-headline">₹{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-grow max-w-xs">
                        <Button size="lg" variant="outline" className="w-full rounded-full" onClick={handleAddToCart}>
                           Add To Cart <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full" onClick={handleBuyNow}>
                            Buy Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
