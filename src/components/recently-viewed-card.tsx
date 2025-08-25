
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/mock-data';

interface RecentlyViewedCardProps {
  product: Product;
}

export function RecentlyViewedCard({ product }: RecentlyViewedCardProps) {
  const imageUrl = (product.images && product.images.length > 0 && product.images[0].url) 
    ? product.images[0].url 
    : "https://placehold.co/100x100.png";
  
  const aiHint = (product.images && product.images.length > 0 && product.images[0].hint)
    ? product.images[0].hint
    : "";

  return (
    <Link href={`/product/${product.id}`} className="group block flex-shrink-0 w-24">
      <div className="relative overflow-hidden rounded-full aspect-square bg-secondary p-1 border-2 border-transparent group-hover:border-primary transition-all">
        <Image
          src={imageUrl}
          alt={product.name}
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={aiHint}
        />
      </div>
      <p className="text-xs text-center mt-2 font-medium text-muted-foreground truncate group-hover:text-primary">{product.name}</p>
    </Link>
  );
}
