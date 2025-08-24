
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';

// This function tells Next.js which dynamic routes to pre-render at build time.
export async function generateStaticParams() {
  // In a real app, you might want to fetch a list of product IDs here.
  // For now, we'll keep it simple, as this might not be strictly necessary
  // if you're fetching data dynamically on every request in a server environment.
  return [];
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product: Product | null = await getProduct(params.id);

  if (!product) {
    notFound();
  }
  
  return <ProductDetailsClient product={product} />;
}
