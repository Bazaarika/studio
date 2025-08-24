
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default async function CategoriesPage() {
  const products: Product[] = await getProducts();
  
  const categoryFilters = ["Menswear", "Womenswear", "Everything", "Accessories", "Shoes"];

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search" className="pl-10 h-11 rounded-full bg-secondary focus:bg-background" />
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
                <SlidersHorizontal className="h-5 w-5"/>
            </Button>
            <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
            </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categoryFilters.map((filter, index) => (
                 <Button key={filter} variant={index === 0 ? "default" : "secondary"} className="rounded-full">
                    {filter}
                </Button>
            ))}
        </div>
      </header>

      <section>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
