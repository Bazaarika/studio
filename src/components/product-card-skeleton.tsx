import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative overflow-hidden rounded-xl">
        <Skeleton className="aspect-[3/4] w-full" />
      </div>
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
