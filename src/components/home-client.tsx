
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/mock-data';
import { ArrowRight, Timer, History, Sparkles, Loader2, Hand } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
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
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
        </div>
    )
  }

  return (
    <section className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Hi, {user?.displayName || 'User'} <Hand className="h-6 w-6 text-yellow-400" />
        </h2>
        <p className="text-muted-foreground">Elevate your complexion care</p>
      </div>
      <Avatar className="h-12 w-12">
        <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
        <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
      </Avatar>
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
}

export function HomeClient({ allProducts, suggestedProducts }: HomeClientProps) {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { recentlyViewedIds } = useRecentlyViewed();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  const timeLeft = useCountdown();
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDisplayedProducts(allProducts.slice(0, 8)); // Load initial 8 products
    setHasMore(allProducts.length > 8);
  }, [allProducts]);

  // Filter products for "Recently Viewed" section
  useEffect(() => {
    if (allProducts.length > 0 && recentlyViewedIds.length > 0) {
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
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const dealOfTheDay = getDealOfTheDay(allProducts);
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

  return (
    <div className="space-y-12">
        <HomeHeader />
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
                  src="https://picsum.photos/400/400" 
                  alt="Sale model"
                  fill
                  className="object-cover object-center"
                  data-ai-hint="fashion model"
               />
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

        {/* Suggest for you */}
        {suggestedProducts && suggestedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" /> Suggest for you
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {suggestedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}


        {/* Recently Viewed */}
        {isClient && recentlyViewedProducts.length > 0 && (
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
                  Filter by Category
              </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div ref={loader} className="h-10 mt-8 flex justify-center items-center">
            {isClient && hasMore && <Loader2 className="h-8 w-8 animate-spin text-primary"/>}
          </div>
        </section>
      </div>
  );
}
