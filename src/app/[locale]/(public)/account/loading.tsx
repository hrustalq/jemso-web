"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AccountLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.from(container, {
      opacity: 0,
      duration: 0.3,
    });

    return () => {
      gsap.killTweensOf(container);
    };
  }, []);

  return (
    <main ref={containerRef} className="fixed inset-0 z-100 overflow-y-auto bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-2 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted/60" />
      </div>

      {/* Tabs skeleton */}
      <div className="mb-6 flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="rounded-lg border border-border/40 bg-card p-6">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/60" />
            </div>
          ))}
          
          <div className="pt-4">
            <div className="h-10 w-32 animate-pulse rounded-md bg-primary/20" />
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

