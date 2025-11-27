import { Skeleton } from "~/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:gap-4">
        {/* Logo Skeleton */}
        <div className="flex shrink-0 items-center">
          <Skeleton className="h-6 w-20 sm:h-7 sm:w-24 lg:h-8 lg:w-28" />
        </div>

        {/* Desktop Navigation Skeleton - Hidden on mobile/tablet */}
        <div className="hidden flex-1 justify-center lg:flex">
          <div className="flex items-center gap-1 xl:gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Auth Section Skeleton */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop Auth Buttons - Hidden on small mobile */}
          <div className="hidden items-center gap-2 sm:flex">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Mobile Menu Button - Hidden on large screens */}
          <div className="lg:hidden">
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </header>
  );
}

