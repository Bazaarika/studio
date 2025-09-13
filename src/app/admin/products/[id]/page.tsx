import { getProduct } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ProductForm } from '../../_components/product-form';
import { notFound } from 'next/navigation';

// This is now a Server Component that fetches data
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    notFound();
  }
  
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // We pass the server-fetched data as a prop to the client component
  return <ProductForm mode="edit" initialData={product} userRole="admin" />;
}
