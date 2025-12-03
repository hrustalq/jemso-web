export default function BlogLoading() {
  return (
    <main className="fixed inset-0 z-100 min-h-screen overflow-y-auto bg-background/95 backdrop-blur-sm animate animate-fadeIn">
      {/* Hero skeleton */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto mb-4 h-12 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted/60" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Categories skeleton */}
        <div className="mb-12">
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 animate-pulse rounded-md bg-muted"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Blog posts skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate animate-fadeInUp overflow-hidden rounded-lg border border-border/40 bg-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image skeleton */}
              <div className="aspect-video w-full animate-pulse bg-muted" />

              {/* Content skeleton */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                </div>

                <div className="mb-2 h-6 w-full animate-pulse rounded bg-muted" />
                <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-muted/60" />

                <div className="flex items-center gap-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted/60" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
