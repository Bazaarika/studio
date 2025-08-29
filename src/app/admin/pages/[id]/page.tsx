
'use client';

import { useEffect, useState } from 'react';
import { getPage } from '@/lib/firebase/firestore';
import type { Page } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import { PageForm } from '../_components/page-form';
import { useParams } from 'next/navigation';

export default function EditPage() {
  const params = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = params.id as string;
  
  useEffect(() => {
    if (!id) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        const fetchedPage = await getPage(id);
        if (fetchedPage) {
          setPage(fetchedPage);
        } else {
          setError('Page not found.');
        }
      } catch (err) {
        console.error("Failed to fetch page:", err);
        setError('Failed to load page data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
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

  return <PageForm mode="edit" initialData={page} />;
}
