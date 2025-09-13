
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product, Category, PopulatedHomeSection } from '@/lib/mock-data';
import * as LucideIcons from 'lucide-react';
import { Timer, History, Sparkles, Loader2, Hand, TrendingUp } from 'lucide-react';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
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

// Helper function to get the deal of the day based on the current date
const getDealOfTheDay = (products: Product[]): Product | null => {
  if (products.length === 0) {
    return null;
  }
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return products[dayOfYear % products.length];
};

// Custom hook for the countdown timer
const useCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            const distance = endOfDay.getTime() - now.getTime();

            if (distance < 0) {
                setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
            } else {
                const hours = Math.floor((distance / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
                const minutes = Math.floor((distance / 1000 / 60) % 60).toString().padStart(2, '0');
                const seconds = Math.floor((distance / 1000) % 60).toString().padStart(2, '0');
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return timeLeft;
};

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
  
  const timeLeft = useCountdown();
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

  const dealOfTheDay = useMemo(() => getDealOfTheDay(allProducts), [allProducts]);
  const discountPercent = dealOfTheDay?.compareAtPrice && dealOfTheDay?.price
    ? Math.round(((dealOfTheDay.compareAtPrice - dealOfTheDay.price) / dealOfTheDay.compareAtPrice) * 100)
    : 0;
  
  const CountdownBlock = ({ value, label }: { value: string, label: string }) => (
      <div className="flex flex-col items-center">
          <div className="text-2xl md:text-3xl font-bold text-background bg-primary/20 rounded-lg p-2 w-12 h-12 flex items-center justify-center">
              {value}
          </div>
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
  );
  
  const CategoryCard = ({ category }: { category: Category }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[category.icon] || LucideIcons.ShoppingBag;
    return (
        <Link href={`/categories?category=${category.name}`} className="flex flex-col items-center gap-2 flex-shrink-0 w-20 group">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <IconComponent className="h-8 w-8 text-primary group-hover:text-primary/80" />
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


        {/* Deal of the Day Section */}
        {dealOfTheDay && (
          <section>
             <h2 className="text-2xl font-bold font-headline mb-4">Deal of the Day</h2>
             <div className={cn(
                  "grid md:grid-cols-2 gap-6 md:gap-8 rounded-2xl p-4 md:p-6",
                  "bg-gradient-to-br from-primary/10 via-secondary to-secondary border-2 border-primary/20"
              )}>
                <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
                   <Image 
                      src={dealOfTheDay.images?.[0]?.url || 'https://picsum.photos/600/600'}
                      alt={dealOfTheDay.name}
                      fill
                      className="object-cover"
                      data-ai-hint={dealOfTheDay.images?.[0]?.hint || ''}
                      priority
                   />
                   <Badge variant="destructive" className="absolute top-3 left-3 text-sm py-1 px-3">On Sale!</Badge>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  <h3 className="text-2xl md:text-3xl font-bold font-headline">{dealOfTheDay.name}</h3>
                  <p className="text-muted-foreground text-sm">{dealOfTheDay.description}</p>
                  <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">₹{dealOfTheDay.price.toFixed(2)}</span>
                      {dealOfTheDay.compareAtPrice && (
                          <>
                            <span className="text-lg text-muted-foreground line-through">₹{dealOfTheDay.compareAtPrice.toFixed(2)}</span>
                            <Badge variant="secondary" className="text-primary font-bold">{discountPercent}% OFF</Badge>
                          </>
                      )}
                  </div>

                   <div className="space-y-2">
                       <p className="font-semibold text-sm flex items-center gap-2"><Timer className="h-5 w-5 text-primary"/> Offer ends in:</p>
                       <div className="flex items-center gap-2 text-primary">
                           <CountdownBlock value={timeLeft.hours} label="Hours" />
                           <span className="text-2xl font-bold pb-4">:</span>
                           <CountdownBlock value={timeLeft.minutes} label="Mins" />
                            <span className="text-2xl font-bold pb-4">:</span>
                           <CountdownBlock value={timeLeft.seconds} label="Secs" />
                       </div>
                   </div>

                  <Button asChild size="lg" className="mt-2 rounded-full w-full md:w-auto">
                    <Link href={`/product/${dealOfTheDay.id}`}>View Deal</Link>
                  </Button>
                </div>
              </div>
          </section>
        )}

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
