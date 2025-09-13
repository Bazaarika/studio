import { getProducts } from '@/lib/firebase/firestore';
import { CategoriesClient } from '@/components/categories-client';
import { generateCategories, type AiCategory } from '@/ai/flows/generate-categories';

const ALL_CATEGORY: AiCategory = { name: 'All', keywords: [] };

// This is now a Server Component responsible for initial data fetching
export default async function CategoriesPage() {
  const products = await getProducts();

  // Generate categories on the server
  let aiCategories: AiCategory[] = [ALL_CATEGORY];
  if (products.length > 0) {
      try {
          const productDetails = products.map(p => ({ name: p.name, description: p.description }));
          const result = await generateCategories({ products: productDetails });
          aiCategories = [ALL_CATEGORY, ...result.categories];
      } catch (error) {
          console.error("Failed to fetch AI categories on server:", error);
          // Fallback to just "All" on error
          aiCategories = [ALL_CATEGORY];
      }
  }
  
  // Pass the server-fetched data to the client component
  return <CategoriesClient initialProducts={products} initialCategories={aiCategories} />;
}
