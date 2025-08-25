
'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import { ProductForm } from '../../_components/product-form';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = params.id as string;
  
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProduct(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  return <ProductForm mode="edit" initialData={product} />;
}

    