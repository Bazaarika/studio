
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isWishlisted = product.id ? wishlist.includes(product.id) : false;

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!product.id) return;
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from wishlist',
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: 'Added to wishlist',
      });
    }
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

  const imageUrl = (product.images && product.images.length > 0 && product.images[0].url) 
    ? product.images[0].url 
    : "https://placehold.co/400x533.png";
  
  const aiHint = (product.images && product.images.length > 0 && product.images[0].hint)
    ? product.images[0].hint
    : "";


  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl">
        <div className="bg-secondary p-2 rounded-xl aspect-[3/4]">
             <Image
                src={imageUrl}
                alt={product.name}
                width={400}
                height={533}
                priority={priority}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                data-ai-hint={aiHint}
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
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
        <div className="flex items-center justify-between gap-4">
            <p className="text-base font-bold text-foreground">&#8377;{product.price.toFixed(2)}</p>
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
