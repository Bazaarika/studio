
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product, Category, PopulatedHomeSection } from '@/lib/mock-data';
import * as LucideIcons from 'lucide-react';
import { History, Sparkles, Loader2, Hand, TrendingUp, ShoppingBag } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { RecentlyViewedCard } from '@/components/recently-viewed-card';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

function HomeHeader() {
  const { user, loading } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return "U";
    return name.trim()[0].toUpperCase();
  };
  
  if (loading) {
    return (
        <section className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
        </section>
    )
  }

  return (
    <section className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Hi, {user?.displayName || 'User'} <Hand className="h-6 w-6 text-yellow-400" />
        </h2>
        <p className="text-muted-foreground">Find your next favorite thing</p>
      </div>
       <Link href="/profile">
        <Avatar className="h-12 w-12">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
        </Avatar>
       </Link>
    </section>
  );
}

interface HomeClientProps {
    allProducts: Product[];
    suggestedProducts: Product[];
    trendingProducts: Product[];
    initialLayout: PopulatedHomeSection[];
    initialCategories: Category[];
}

export function HomeClient({ allProducts, suggestedProducts, trendingProducts, initialLayout, initialCategories }: HomeClientProps) {
  // Initialize state directly with server-provided props to prevent hydration mismatch
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(() => allProducts.slice(0, 8));
  const [hasMore, setHasMore] = useState(() => allProducts.length > 8);
  
  const { recentlyViewedIds } = useRecentlyViewed();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  
  const loader = useRef<HTMLDivElement | null>(null);

  // Logic for Recently Viewed Products - runs only on the client
  useEffect(() => {
    if (allProducts.length > 0) {
      const viewed = recentlyViewedIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);
      setRecentlyViewedProducts(viewed);
    }
  }, [allProducts, recentlyViewedIds]);

  // Handle infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setDisplayedProducts((prev) => {
        const nextIndex = prev.length;
        const newProducts = allProducts.slice(nextIndex, nextIndex + 4);
        if (nextIndex + newProducts.length >= allProducts.length) {
          setHasMore(false);
        }
        return [...prev, ...newProducts];
      });
    }
  }, [allProducts, hasMore]);
  
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [handleObserver]);

  const CategoryCard = ({ category }: { category: Category }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[category.icon] || ShoppingBag;
    return (
        <Link href={`/categories?category=${category.name}`} className="flex flex-col items-center gap-2 flex-shrink-0 w-20 group">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors relative overflow-hidden">
                 {category.imageUrl ? (
                    <Image src={category.imageUrl} alt={category.name} fill className="object-contain p-2" />
                ) : (
                    <IconComponent className="h-8 w-8 text-primary group-hover:text-primary/80" />
                )}
            </div>
            <p className="text-sm font-medium text-center text-muted-foreground group-hover:text-primary">{category.name}</p>
        </Link>
    );
  };

  const hasCustomLayout = initialLayout.length > 0;

  return (
    <div className="space-y-12">
        <HomeHeader />
        
        {/* Category Section */}
        <section>
            <h2 className="text-2xl font-bold font-headline mb-4">Categories</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                {initialCategories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
            </div>
        </section>

        {/* DYNAMIC SECTIONS FROM ADMIN */}
        {hasCustomLayout && initialLayout.map(section => (
            <section key={section.id}>
                <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    {section.title}
                </h2>
                {section.description && <p className="text-muted-foreground mb-4">{section.description}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {section.products.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index < 4} />
                    ))}
                </div>
            </section>
        ))}


        {/* FALLBACK SECTIONS IF NO LAYOUT FROM ADMIN */}
        {!hasCustomLayout && (
            <>
                {/* Suggested for You */}
                {suggestedProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent" /> Suggested for you
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {suggestedProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index < 4} />
                    ))}
                    </div>
                </section>
                )}

                {/* Trending Products */}
                {trendingProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-accent" /> Trending Now
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {trendingProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index < 4} />
                    ))}
                    </div>
                </section>
                )}
            </>
        )}

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
                <History className="h-6 w-6"/> Recently Viewed
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {recentlyViewedProducts.map((product) => (
                <RecentlyViewedCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline">All Products</h2>
              <Link href="/categories" className="text-sm font-semibold text-muted-foreground hover:text-primary">
                  View All
              </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div ref={loader} className="h-10 mt-8 flex justify-center items-center">
            {hasMore && <Loader2 className="h-8 w-8 animate-spin text-primary"/>}
          </div>
        </section>
      </div>
  );
}

    
