
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to product page
    setIsWishlisted(!isWishlisted);
     toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
    });
  }

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={product.aiHint}
        />
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background"
          onClick={toggleWishlist}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-accent text-accent" : "text-foreground")} />
        </Button>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
        <p className="mt-1 text-sm font-bold text-primary">₹{product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
