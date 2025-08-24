
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product); // In a real app, you'd add with the selected quantity
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
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30 md:static md:border-0 md:bg-transparent md:backdrop-blur-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 h-24 md:h-auto">
                     <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                            <Minus />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                         <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQuantity(q => q + 1)}>
                            <Plus />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-grow">
                        <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart}>
                           Add To Cart
                        </Button>
                        <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleBuyNow}>
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
