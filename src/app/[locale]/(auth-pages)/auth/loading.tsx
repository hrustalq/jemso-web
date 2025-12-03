export default function AuthLoading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 px-4 page-pt safe-pb backdrop-blur-sm animate animate-fadeIn">
      <div className="w-full max-w-md rounded-lg border border-border/40 bg-card p-8 shadow-lg animate-pulse">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider">JEMSO</h1>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-5">
          {/* Title skeleton */}
          <div className="h-8 w-3/4 rounded bg-muted" />

          {/* Description skeleton */}
          <div className="h-4 w-full rounded bg-muted/60" />
          <div className="h-4 w-2/3 rounded bg-muted/60" />

          {/* Input skeletons */}
          <div className="space-y-3 pt-2">
            <div className="h-11 w-full rounded-md bg-muted" />
            <div className="h-11 w-full rounded-md bg-muted" />
          </div>

          {/* Button skeleton */}
          <div className="pt-2">
            <div className="h-11 w-full rounded-md bg-primary/20" />
          </div>

          {/* Footer skeleton */}
          <div className="flex justify-center pt-2">
            <div className="h-4 w-48 rounded bg-muted/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
