
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/mock-data';
import { getProducts } from '@/lib/firebase/firestore';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const trendingProducts = products.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-secondary rounded-lg p-6 md:p-8 text-secondary-foreground relative overflow-hidden min-h-[300px] flex items-center">
        <div className="flex flex-col items-start gap-4 z-10 relative">
          <div className="bg-background/80 text-foreground p-4 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-primary">
              Summer Collection is Here
            </h1>
            <p className="text-sm mt-2">Find your perfect style for the season.</p>
          </div>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Link href="/categories">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2">
             <Image 
                src="https://placehold.co/400x400.png" 
                alt="Sale model"
                fill
                className="object-cover object-center"
                data-ai-hint="fashion model"
             />
        </div>
      </section>

      {/* Recommended Styles */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-headline">Recommended Styles</h2>
            <Link href="/categories" className="text-sm font-semibold text-muted-foreground hover:text-primary">
                See All
            </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] w-full bg-muted rounded-xl"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))
          ) : (
            trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

    </div>
  );
}
