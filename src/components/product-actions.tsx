
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleAddToCart = () => {
        toast({
            title: "Added to cart!",
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleBuyNow = () => {
        router.push('/checkout');
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    <div>
                        <p className="text-sm text-muted-foreground">Total price</p>
                        <p className="text-xl md:text-2xl font-bold">₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="lg" className="hidden sm:inline-flex" onClick={handleAddToCart}>
                            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                        <Button size="icon" className="sm:hidden" onClick={handleAddToCart}>
                            <ShoppingBag className="h-5 w-5" />
                        </Button>
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleBuyNow}>
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
