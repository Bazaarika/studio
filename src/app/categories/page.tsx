
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { CategoriesClient } from '@/components/categories-client';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <CategoriesClient products={products} />;
}
