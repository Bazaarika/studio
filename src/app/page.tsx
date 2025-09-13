import { getProducts, getHomeLayout, getCategories } from '@/lib/firebase/firestore';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { HomeClient } from '@/components/home-client';
import type { Product, PopulatedHomeSection } from '@/lib/mock-data';
import { Suspense } from 'react';
import { HomeLoadingSkeleton } from './loading';

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
     return <HomeLoadingSkeleton />;
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
  return (
    <Suspense fallback={<HomeLoadingSkeleton />}>
      <HomeClient 
        allProducts={allProducts} 
        suggestedProducts={suggestedProducts} 
        trendingProducts={trendingProducts}
        initialLayout={populatedLayout}
        initialCategories={categories}
      />
    </Suspense>
  );
}
