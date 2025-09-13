
import { Loader2 } from 'lucide-react';

export default function Loading() {
  // A simple spinner for route transitions, as requested.
  // This will be shown instantly for navigation between pages.
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
