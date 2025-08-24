
'use client';

import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      try {
        const fetchedProduct = await getProduct(params.id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          notFound();
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
    return notFound();
  }
  
  return <ProductDetailsClient product={product} />;
}
