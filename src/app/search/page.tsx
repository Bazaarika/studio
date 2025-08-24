
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { Search } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const allProducts: Product[] = await getProducts();
  
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline">Search Results</h1>
        {query ? (
            <p className="text-muted-foreground">Showing results for: <span className="font-semibold text-primary">{query}</span></p>
        ): (
             <p className="text-muted-foreground">Please enter a search term.</p>
        )}
      </header>
      
      <section>
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-secondary/50 rounded-lg flex flex-col items-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2 font-headline">No products found</h2>
                <p className="text-muted-foreground">We couldn't find any products matching your search.</p>
            </div>
        )}
      </section>
    </div>
  );
}
