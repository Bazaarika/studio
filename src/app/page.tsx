
import { getProducts, getHomeLayout, getCategories } from '@/lib/firebase/firestore';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { HomeClient } from '@/components/home-client';
import type { Product, PopulatedHomeSection } from '@/lib/mock-data';

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

// This is now a Server Component, fetching data on the server
export default async function Home() {
  // Fetch all required data in parallel for performance
  const [allProducts, homeLayout, categories] = await Promise.all([
    getProducts(),
    getHomeLayout(),
    getCategories()
  ]);

  // If there are no products, show a loading/empty state.
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

  // Populate the layout sections with full product details
  const populatedLayout: PopulatedHomeSection[] = homeLayout.map(section => {
      const products = section.productIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined); // Ensure no undefined products
      return { ...section, products };
  });

  // Create fallback data in case the admin layout is empty
  const shuffledProducts = shuffleArray([...allProducts]);
  const suggestedProducts = shuffledProducts.slice(0, 4);
  const trendingProducts = shuffleArray([...allProducts]).slice(0, 4);

  // Pass all server-fetched data to the Client Component
  return <HomeClient 
    allProducts={allProducts} 
    suggestedProducts={suggestedProducts} 
    trendingProducts={trendingProducts}
    initialLayout={populatedLayout}
    initialCategories={categories}
  />;
}
