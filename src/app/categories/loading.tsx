
import { Loader2 } from 'lucide-react';

export default function CategoriesLoading() {
  // A simple spinner for route transitions to the categories page.
  return (
    <div className="flex justify-center items-center h-[calc(100vh-150px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
