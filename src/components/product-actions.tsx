
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Zap } from "lucide-react";

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
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30 md:hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-2 h-20">
                    <div className="flex flex-col items-start">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-xl font-bold font-headline">₹{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button size="lg" variant="outline" className="rounded-full flex-1" onClick={handleAddToCart}>
                           <ShoppingCart className="h-5 w-5 md:mr-2" /> 
                           <span className="hidden md:inline">Add To Cart</span>
                        </Button>
                        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-grow" onClick={handleBuyNow}>
                            <Zap className="h-5 w-5 md:mr-2" /> 
                            <span className="hidden md:inline">Buy Now</span>
                             <span className="inline md:hidden">Buy Now</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
