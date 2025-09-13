import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/firebase/firestore';
import type { Product } from '@/lib/mock-data';
import { ProductDetailsClient } from '@/components/product-details-client';

// Make this a Server Component to fetch data on the server
export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    notFound();
  }

  // Fetch the main product and all other products in parallel
  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getProducts()
  ]);

  // If no product is found, render the notFound UI
  if (!product) {
    notFound();
  }

  // Find related products from the same category
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4); // Limit to 4 related products

  // Pass the fetched product data and related products as props to the Client Component
  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
