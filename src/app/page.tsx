
import { getProducts } from '@/lib/firebase/firestore';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { HomeClient } from '@/components/home-client';

export default async function Home() {
  const allProducts = await getProducts();
  
  if (!allProducts || allProducts.length === 0) {
     return (
        <div className="space-y-12">
            <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
                 <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    )
  }

  return <HomeClient allProducts={allProducts} />;
}
