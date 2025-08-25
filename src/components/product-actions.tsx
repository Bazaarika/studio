
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Zap } from "lucide-react";

interface ProductActionsProps {
    product: Product;
    quantity: number;
}

export function ProductActions({ product, quantity }: ProductActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast({
            title: "Added to cart!",
            description: `${quantity} x ${product.name} has been added to your cart.`,
        });
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        router.push('/checkout');
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30 md:static md:border-0 md:bg-transparent md:p-0">
            <div className="container mx-auto px-4 md:px-0">
                <div className="flex items-center justify-between gap-2 h-20 md:h-auto">
                    <div className="hidden md:flex flex-col items-start">
                        {/* Desktop view could have price here if needed */}
                    </div>
                    {/* Mobile Price Display */}
                    <div className="flex-shrink-0 md:hidden">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <p className="text-xl font-bold font-headline">₹{product.price.toFixed(2)}</p>
                    </div>

                    {/* Buttons for both mobile and desktop */}
                    <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                        <Button size="lg" variant="outline" className="rounded-full w-1/2 md:w-auto md:flex-1" onClick={handleAddToCart}>
                           <ShoppingCart className="h-5 w-5 md:mr-2" /> 
                           <span className="hidden md:inline">Add To Cart</span>
                           <span className="inline md:hidden">Add</span>
                        </Button>
                        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-1/2 md:w-auto md:flex-grow" onClick={handleBuyNow}>
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
