import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeLoadingSkeleton() {
  return (
    <div className="space-y-12">
        {/* Header Skeleton */}
        <section className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
        </section>

        {/* Categories Skeleton */}
        <div className="space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-4 w-16 rounded-md" />
                      </div>
                  ))}
              </div>
        </div>

        {/* Featured Products Section Skeleton */}
        <div className="space-y-4">
             <Skeleton className="h-8 w-1/3 rounded-md" />
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        </div>
        
        {/* Another Products Section Skeleton */}
        <div className="space-y-4">
             <Skeleton className="h-8 w-1/3 rounded-md" />
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        </div>
    </div>
  )
}


export default function Loading() {
  return <HomeLoadingSkeleton />;
}
