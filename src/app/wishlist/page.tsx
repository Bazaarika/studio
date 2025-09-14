
import { getProducts } from '@/lib/firebase/firestore';
import { WishlistClient } from '@/components/wishlist-client';

export const revalidate = 60; // Revalidate every 60 seconds

// This is now a Server Component responsible for initial data fetching
export default async function WishlistPage() {
  // We fetch all products on the server. The client will then filter them based on its state.
  // This is more efficient than making multiple single-product requests from the client.
  const allProducts = await getProducts();
  
  return <WishlistClient allProducts={allProducts} />;
}
