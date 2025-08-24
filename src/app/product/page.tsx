
// This page is no longer needed as we are using the dynamic route [id]/page.tsx
// You can delete this file.
// For now, we'll redirect to the categories page.
import { redirect } from 'next/navigation';

export default function ProductPage() {
    redirect('/categories');
}
