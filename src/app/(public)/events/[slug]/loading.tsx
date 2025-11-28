"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Skeleton } from "~/components/ui/skeleton";

export default function EventLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".skeleton-item", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.to(".pulse-item", {
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className="min-h-(--content-height) page-pt">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div ref={containerRef} className="mx-auto max-w-4xl">
            {/* Back link skeleton */}
            <div className="skeleton-item mb-8">
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Cover image skeleton */}
            <div className="skeleton-item mb-8">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            {/* Status badge skeleton */}
            <div className="skeleton-item mb-4">
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>

            {/* Category skeleton */}
            <div className="skeleton-item mb-4">
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>

            {/* Title skeleton */}
            <div className="skeleton-item mb-6 space-y-3">
              <Skeleton className="pulse-item h-10 w-full" />
              <Skeleton className="pulse-item h-10 w-3/4" />
            </div>

            {/* Excerpt skeleton */}
            <div className="skeleton-item mb-8 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>

            {/* Event details grid skeleton */}
            <div className="skeleton-item mb-8 grid gap-4 rounded-lg border border-border/40 bg-card p-6 sm:grid-cols-2">
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
            <div className="skeleton-item mb-8 flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="skeleton-item mb-8 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="pulse-item h-4 w-full" />
                  <Skeleton className="pulse-item h-4 w-full" />
                  <Skeleton className="pulse-item h-4 w-5/6" />
                </div>
              ))}
            </div>

            {/* Views skeleton */}
            <div className="skeleton-item mt-8 border-t border-border/40 pt-6 text-center">
              <Skeleton className="mx-auto h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

