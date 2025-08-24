
import { ProductCard } from '@/components/product-card';
import { categories } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';

export default async function CategoriesPage() {
  const products: Product[] = await getProducts();
  
  return (
    <div className="space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline">All Categories</h1>
        <p className="text-muted-foreground">Find what you're looking for from our wide selection of categories.</p>
      </header>

      <section className="flex flex-wrap justify-center gap-2">
        {categories.map((category, index) => (
          <Button key={category.id} variant={index === 0 ? "default" : "secondary"}>
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </section>
      
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
