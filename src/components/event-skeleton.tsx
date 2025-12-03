import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function EventSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className={`animate animate-fadeInUp stagger-${index + 1} overflow-hidden border-border/40 bg-card/50 backdrop-blur`}
        >
          {/* Cover Image skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          {/* Content */}
          <div className="space-y-3 p-6">
            {/* Title */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />

            {/* Excerpt */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Meta info */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
