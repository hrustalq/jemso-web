import { Skeleton } from "~/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-[var(--safe-top)]">
      {/* Top Bar */}
      <div className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center px-4 sm:h-20 pl-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))]">
          
          {/* Left Section */}
          <div className="flex items-center gap-2 flex-1">
            {/* Mobile: Hamburger Menu Skeleton */}
            <div className="md:hidden">
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
            
            {/* Desktop: Social Links Skeleton */}
            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          {/* Center Section: Logo Skeleton */}
          <div className="shrink-0">
            <Skeleton className="h-[16px] w-[85px] sm:h-[19px] sm:w-[95px]" />
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-2 flex-1">
            {/* Language Switcher Skeleton */}
            <Skeleton className="h-9 w-9 rounded-md" />
            
            {/* Auth Button Skeleton */}
            <Skeleton className="h-9 w-9 sm:w-24 rounded-md" />

            {/* Desktop: Hamburger Menu Skeleton */}
            <div className="hidden md:block">
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Second Layer - Hidden on mobile */}
      <div className="hidden md:block border-b border-border/40">
        <div className="container mx-auto px-4 pl-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))]">
          <div className="flex items-center justify-center gap-6 py-3 sm:gap-8 sm:py-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-18" />
          </div>
        </div>
      </div>
    </header>
  );
}
