import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export function FooterSkeleton() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-3">
            <Skeleton className="h-7 w-24 sm:h-8 sm:w-28" />
            <Skeleton className="h-4 w-48" />
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-md" />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {Array.from({ length: 4 }).map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-3 sm:space-y-4 lg:col-span-2">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2 sm:space-y-3">
                {Array.from({ length: 3 }).map((_, linkIdx) => (
                  <Skeleton key={linkIdx} className="h-4 w-20" />
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        <Separator className="my-6 sm:my-8 lg:my-12" />

        {/* Copyright Section */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </footer>
  );
}

