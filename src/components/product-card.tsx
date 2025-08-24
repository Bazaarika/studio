
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
  isWishlistedDefault?: boolean;
}

export function ProductCard({ product, isWishlistedDefault = false }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedDefault);

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
     toast({
      title: !isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
    });
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <Link href={`/product/${product.id}`} className="group block text-center md:text-left">
      <div className="relative overflow-hidden rounded-xl">
        <div className="bg-secondary p-4">
             <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="aspect-square w-full object-contain transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.aiHint}
                />
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background"
          onClick={toggleWishlist}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500 text-red-500" : "text-foreground")} />
        </Button>
      </div>
      <div className="mt-3 space-y-1">
        {isWishlistedDefault && (
            <div className="flex items-center justify-center md:justify-start gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                <span className="text-sm font-bold">4.9</span>
                <span className="text-xs text-muted-foreground">(235)</span>
            </div>
        )}
        <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
        <div className="flex items-center justify-center md:justify-between gap-4">
            <p className="text-base font-bold text-primary">₹{product.price.toFixed(2)}</p>
             <Button 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full bg-secondary hover:bg-primary/20"
                onClick={handleAddToCart}
                >
                <ShoppingCart className="h-4 w-4 text-primary" />
            </Button>
        </div>
      </div>
    </Link>
  );
}
