
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';

// This function tells Next.js which dynamic routes to pre-render at build time.
export async function generateStaticParams() {
  const products: Product[] = await getProducts();
 
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product: Product | null = await getProduct(params.id);

  if (!product) {
    notFound();
  }
  
  return <ProductDetailsClient product={product} />;
}
