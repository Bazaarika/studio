
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/mock-data';
import { getProducts } from '@/lib/firebase/firestore';
import { ArrowRight, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const timeLeft = useCountdown();

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
  const dealOfTheDay = getDealOfTheDay(products);

  return (
    <>
      <Header />
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

        {/* Deal of the Day Section */}
        {dealOfTheDay && (
          <section>
             <h2 className="text-2xl font-bold font-headline mb-4">Deal of the Day</h2>
             <Card className="overflow-hidden bg-primary/5 border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/3] md:aspect-square">
                     <Image 
                        src={dealOfTheDay.images?.[0]?.url || 'https://placehold.co/600x600.png'}
                        alt={dealOfTheDay.name}
                        fill
                        className="object-cover"
                        data-ai-hint={dealOfTheDay.images?.[0]?.hint || ''}
                     />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold font-headline">{dealOfTheDay.name}</h3>
                    <p className="text-muted-foreground mt-2">{dealOfTheDay.description}</p>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-3xl font-bold text-primary">₹{dealOfTheDay.price.toFixed(2)}</span>
                        {dealOfTheDay.compareAtPrice && (
                            <span className="text-lg text-muted-foreground line-through">₹{dealOfTheDay.compareAtPrice.toFixed(2)}</span>
                        )}
                    </div>
                     <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
                        <Timer className="h-6 w-6"/>
                        <span>Offer ends in: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
                    </div>
                    <Button asChild size="lg" className="mt-6 rounded-full w-full md:w-auto">
                      <Link href={`/product/${dealOfTheDay.id}`}>View Deal</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
             </Card>
          </section>
        )}

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
    </>
  );
}
