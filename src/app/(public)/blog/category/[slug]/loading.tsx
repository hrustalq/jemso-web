import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";

export default function CategoryLoading() {
  return (
    <main
      className="min-h-(--content-height)"
      style={{ paddingTop: "calc(var(--header-height) + var(--safe-top))" }}
    >
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden border-b border-border/40 bg-linear-to-br from-background via-background/95 to-primary/5">
        {/* Decorative gradient orbs */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
          {/* Back Button Skeleton */}
          <Skeleton className="mb-6 h-5 w-36 md:mb-8 md:h-6 md:w-40" />

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            {/* Title and Description Skeleton */}
            <div className="flex-1">
              <Skeleton className="mb-3 h-9 w-64 sm:h-10 sm:w-80 md:mb-4 md:h-12 md:w-96 lg:h-16" />
              <Skeleton className="mb-2 h-5 w-full max-w-2xl md:h-6" />
              <Skeleton className="h-5 w-3/4 max-w-2xl md:h-6" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="flex flex-wrap gap-3 md:flex-col md:gap-2">
              <Skeleton className="h-14 w-32 rounded-lg md:h-16 md:w-40" />
              <Skeleton className="h-14 w-32 rounded-lg md:h-16 md:w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="space-y-16">
          {/* News Section Skeleton */}
          <section>
            <div className="mb-8">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="mt-2 h-5 w-96" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/40">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-6">
                    <Skeleton className="mb-4 h-4 w-24" />
                    <Skeleton className="mb-3 h-8 w-full" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-4 h-4 w-3/4" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Events Section Skeleton */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Skeleton className="h-9 w-64" />
                <Skeleton className="mt-2 h-5 w-80" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="mb-3 flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="mb-3 h-6 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

