
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/firebase/firestore';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/mock-data';

export default async function WishlistPage() {
  const allProducts = await getProducts();
  const wishlistProducts = allProducts.slice(2, 8); // Mock wishlist items

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold font-headline">Wishlist</h1>
      </header>
      
      {wishlistProducts.length > 0 ? (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} isWishlistedDefault={true} />
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
