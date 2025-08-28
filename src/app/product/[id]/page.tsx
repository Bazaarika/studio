import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';

// Make this a Server Component to fetch data on the server
export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    notFound();
  }

  // Fetch the product data on the server
  const product = await getProduct(id);

  // If no product is found, render the notFound UI
  if (!product) {
    notFound();
  }

  // Pass the fetched product data as a prop to the Client Component
  return <ProductDetailsClient product={product} />;
}
