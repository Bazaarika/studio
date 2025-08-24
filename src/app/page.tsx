import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { categories, Product } from '@/lib/mock-data';
import { getProducts } from '@/lib/firebase/firestore';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const products: Product[] = await getProducts();
  const trendingProducts = products.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-primary rounded-lg p-6 md:p-8 text-primary-foreground relative overflow-hidden">
        <div className="flex flex-col items-start gap-4 z-10 relative">
          <div className="bg-black/80 text-white p-4 rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight uppercase">
              Up To 25% OFF
            </h1>
            <p className="text-sm">ENDS SOON</p>
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
            <h2 className="text-xl font-bold font-headline">Recommended Styles</h2>
            <Link href="/categories" className="text-sm font-semibold text-muted-foreground hover:text-primary">
                See All
            </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}