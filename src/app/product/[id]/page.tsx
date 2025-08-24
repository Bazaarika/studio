
'use client';

import { notFound, useParams } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const id = params.id as string;
      if (!id) return;
      
      try {
        const fetchedProduct = await getProduct(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          // Instead of calling notFound(), which is for server components,
          // we can handle this by setting product to null and showing a message.
          // For now, we'll let the component handle the null product state.
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params]);

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!product) {
    // This will be rendered if the product is not found after loading.
    // In a real app, you might want a more elaborate "Not Found" component here.
    return notFound();
  }
  
  return <ProductDetailsClient product={product} />;
}
