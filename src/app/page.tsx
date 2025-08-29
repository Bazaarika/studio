
import { getProducts, getHomeLayout, getCategories } from '@/lib/firebase/firestore';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { HomeClient } from '@/components/home-client';
import type { Product, HomeSection, PopulatedHomeSection, Category } from '@/lib/mock-data';
import { shuffle } from 'lodash';

// Helper to shuffle an array for random product selection
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};


export default async function Home() {
  const [allProducts, homeLayout, categories] = await Promise.all([
    getProducts(),
    getHomeLayout(),
    getCategories()
  ]);

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

  const populatedLayout: PopulatedHomeSection[] = homeLayout.map(section => {
      const products = section.productIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined);
      return { ...section, products };
  });

  // Fallback data in case the layout is empty
  const shuffledProducts = shuffleArray([...allProducts]);
  const suggestedProducts = shuffledProducts.slice(0, 4);
  const trendingProducts = shuffleArray([...allProducts]).slice(0, 4);

  return <HomeClient 
    allProducts={allProducts} 
    suggestedProducts={suggestedProducts} 
    trendingProducts={trendingProducts}
    initialLayout={populatedLayout}
    initialCategories={categories}
  />;
}
