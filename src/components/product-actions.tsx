
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductActionsProps {
    product: Product;
    quantity: number;
    isVisible: boolean;
}

export function ProductActions({ product, quantity, isVisible }: ProductActionsProps) {
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
        if (!product.id) return;
        const checkoutUrl = `/checkout?buyNow=true&productId=${product.id}&quantity=${quantity}`;
        router.push(checkoutUrl);
    };

    const PriceDisplay = () => (
        <div className="flex flex-col items-start">
             <span className="text-xs text-muted-foreground">Price</span>
            <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold font-headline">&#8377;{product.price.toFixed(2)}</p>
            </div>
        </div>
    );
    
     const DesktopPriceDisplay = () => (
        <div className="flex items-baseline gap-2">
            <p className="text-xl md:text-2xl font-bold font-headline">&#8377;{product.price.toFixed(2)}</p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-base text-muted-foreground line-through">&#8377;{product.compareAtPrice.toFixed(2)}</p>
            )}
        </div>
    );

    return (
        <>
            {/* Sticky bar for mobile */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30 md:hidden"
                    >
                         <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between gap-4 h-20">
                                <div className="flex-grow">
                                    <PriceDisplay />
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button size="lg" variant="outline" className="rounded-full" onClick={handleAddToCart}>
                                       <ShoppingCart className="h-5 w-5" /> 
                                       <span className="ml-2 hidden sm:inline">Add</span>
                                    </Button>
                                    <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBuyNow}>
                                        <Zap className="h-5 w-5" /> 
                                        <span className="ml-2">Buy Now</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Static section for desktop */}
            <div className="hidden md:block">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-muted-foreground">Price</span>
                        <DesktopPriceDisplay />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button size="lg" variant="outline" className="rounded-full w-full" onClick={handleAddToCart}>
                           <ShoppingCart className="h-5 w-5 mr-2" /> 
                           Add To Cart
                        </Button>
                        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-full" onClick={handleBuyNow}>
                            <Zap className="h-5 w-5 mr-2" /> 
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
