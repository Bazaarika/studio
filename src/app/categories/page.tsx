
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { CategoriesClient } from '@/components/categories-client';

export default async function CategoriesPage() {
  const products: Product[] = await getProducts();
  
  return <CategoriesClient products={products} />;
}
