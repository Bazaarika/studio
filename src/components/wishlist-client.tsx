"use client";

import { ProductCard } from '@/components/product-card';
import { Heart, Loader2 } from 'lucide-react';
import type { Product } from '@/lib/mock-data';
import { useWishlist } from '@/hooks/use-wishlist';

interface WishlistClientProps {
  allProducts: Product[];
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const { wishlist, loading } = useWishlist();

  const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id!));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">Wishlist</h1>
      </header>
      
      {wishlistProducts.length > 0 ? (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2 font-headline">Your wishlist is empty</h2>
          <p className="text-muted-foreground">Add items you love to your wishlist to save them for later.</p>
        </div>
      )}
    </div>
  );
}
