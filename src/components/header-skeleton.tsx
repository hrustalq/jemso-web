import { Skeleton } from "~/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Top Bar */}
      <div className="border-b border-border/40">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:h-24">
          {/* Left Section: Social Links Skeleton */}
          <div className="hidden items-center gap-2 md:flex">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          {/* Center Section: Logo Skeleton */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Skeleton className="h-[26px] w-[95px] sm:h-[30px] sm:w-[110px]" />
          </div>

          {/* Right Section: User Actions Skeleton */}
          <div className="flex items-center gap-2">
            {/* My Page Button - Hidden on mobile */}
            <div className="hidden sm:flex">
              <Skeleton className="h-9 w-32" />
            </div>

            {/* Hamburger Menu */}
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Second Layer */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 py-4 sm:gap-8 sm:py-5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-18" />
          </div>
        </div>
      </div>
    </header>
  );
}

