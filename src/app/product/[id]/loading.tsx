import { Skeleton } from '@/components/ui/skeleton';
import { Star, Share2 } from 'lucide-react';

export default function ProductLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 md:gap-8 lg:gap-12">
      {/* Image Gallery Skeleton */}
      <div>
        <div className="bg-secondary rounded-xl p-4 md:p-8">
          <div className="aspect-square relative">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="py-6 md:py-0 space-y-6">
        <div>
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-8 w-3/4" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-muted-foreground/50"/>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-16 rounded-full" />
            <Skeleton className="h-10 w-16 rounded-full" />
            <Skeleton className="h-10 w-16 rounded-full" />
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>

         {/* Actions Skeleton */}
        <div className="hidden md:block pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
