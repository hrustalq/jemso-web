import { Skeleton } from "~/components/ui/skeleton";

export default function EventLoading() {
  return (
    <main className="min-h-(--content-height) page-pt">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Back link skeleton */}
            <div className="animate animate-fadeInUp mb-8">
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Cover image skeleton */}
            <div className="animate animate-fadeInUp delay-100 mb-8">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            {/* Status badge skeleton */}
            <div className="animate animate-fadeInUp delay-200 mb-4">
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>

            {/* Category skeleton */}
            <div className="animate animate-fadeInUp delay-200 mb-4">
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>

            {/* Title skeleton */}
            <div className="animate animate-fadeInUp delay-300 mb-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>

            {/* Excerpt skeleton */}
            <div className="animate animate-fadeInUp delay-400 mb-8 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>

            {/* Event details grid skeleton */}
            <div className="animate animate-fadeInUp delay-500 mb-8 grid gap-4 rounded-lg border border-border/40 bg-card p-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>

            {/* Organizer skeleton */}
            <div className="animate animate-fadeInUp delay-600 mb-8 flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="animate animate-fadeInUp delay-700 mb-8 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>

            {/* Views skeleton */}
            <div className="mt-8 border-t border-border/40 pt-6 text-center">
              <Skeleton className="mx-auto h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
