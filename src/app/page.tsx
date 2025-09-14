
import { getProducts, getHomeLayout, getCategories } from '@/lib/firebase/firestore';
import { HomeClient } from '@/components/home-client';
import type { Product, PopulatedHomeSection } from '@/lib/mock-data';

// Revalidate the page every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

// This is a Server Component, fetching data on the server with caching.
export default async function Home() {
  // Fetch all required data in parallel for performance
  const [allProducts, homeLayout, categories] = await Promise.all([
    getProducts(),
    getHomeLayout(),
    getCategories()
  ]);

  // If there are no products, show a message.
  if (!allProducts || allProducts.length === 0) {
     return <div className="text-center py-20">No products found.</div>;
  }

  // Populate the layout sections with full product details
  const populatedLayout: PopulatedHomeSection[] = homeLayout.map(section => {
      const products = section.productIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined); // Ensure no undefined products
      return { ...section, products };
  });

  // Create deterministic fallback data in case the admin layout is empty
  const suggestedProducts = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 8);

  // Pass all server-fetched data to the Client Component
  return (
    <HomeClient 
      allProducts={allProducts} 
      suggestedProducts={suggestedProducts} 
      trendingProducts={trendingProducts}
      initialLayout={populatedLayout}
      initialCategories={categories}
    />
  );
}
