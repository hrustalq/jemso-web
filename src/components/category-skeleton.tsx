import { Skeleton } from "~/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`animate animate-fadeInUp stagger-${index + 1} flex flex-col`}
        >
          {/* Image skeleton */}
          <Skeleton className="aspect-square w-full rounded-xl" />
          
          {/* Title skeleton */}
          <Skeleton className="mt-3 mx-auto h-4 w-20 sm:w-24" />
        </div>
      ))}
    </div>
  );
}
