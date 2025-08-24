
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { categories, Product } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/lib/firebase/firestore';

export default async function Home() {
  const products: Product[] = await getProducts();
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-secondary/50 rounded-lg p-12 md:p-20">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary mb-4">
          Discover Your Style
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          Explore our curated collection of fashion, accessories, and more. Find pieces that truly represent you.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/categories">Shop Now</Link>
        </Button>
      </section>

      {/* Trending Products */}
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href="/categories">
              <Card className="group text-center p-4 transition-all duration-300 hover:bg-secondary hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center gap-2">
                  <category.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-sm">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
