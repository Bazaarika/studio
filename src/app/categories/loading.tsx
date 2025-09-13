import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <header className="space-y-4">
        {/* Search and Filters Skeleton */}
        <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        {/* Category Tags Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
        </div>
      </header>
      
      {/* Product Grid Skeleton */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
