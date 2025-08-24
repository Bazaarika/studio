
import { ProductCard } from '@/components/product-card';
import { categories } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default async function CategoriesPage() {
  const products: Product[] = await getProducts();
  
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
         <Select defaultValue="menswear">
            <SelectTrigger className="w-auto font-semibold border-none focus:ring-0 text-base">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="menswear">Menswear</SelectItem>
                <SelectItem value="womenswear">Womenswear</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
        </Select>

        <div className="hidden md:flex items-center gap-2">
            {categories.map((category) => (
                <Button key={category.id} variant="ghost" className="text-muted-foreground">
                    {category.name}
                </Button>
            ))}
        </div>
      </header>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
