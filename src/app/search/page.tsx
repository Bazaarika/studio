
import { Suspense } from 'react';
import { SearchResults } from './_components/search-results';
import { Loader2 } from 'lucide-react';

function SearchLoading() {
    return (
        <div className="space-y-8">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-bold font-headline">Search Results</h1>
                <div className="h-5 bg-muted w-1/3 mx-auto rounded"></div>
            </header>
            <div className="flex justify-center items-center min-h-[40vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
}
