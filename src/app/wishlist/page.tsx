
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const wishlistProducts = products.slice(2, 6); // Mock wishlist items

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-center text-center space-x-3">
        <Heart className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-bold font-headline">Your Wishlist</h1>
      </header>
      
      {wishlistProducts.length > 0 ? (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20 bg-secondary/50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground">Add items you love to your wishlist to save them for later.</p>
        </div>
      )}
    </div>
  );
}
