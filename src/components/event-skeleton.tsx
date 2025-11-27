"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function EventSkeleton() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".skeleton-card");
    if (cards.length === 0) return;

    // Simple fade-in only
    const tl = gsap.timeline();
    
    cards.forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 30 });
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, index * 0.15);
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={cardsRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="skeleton-card animate-pulse overflow-hidden border-border/40 bg-card/50 backdrop-blur"
        >
          {/* Cover Image skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          {/* Content */}
          <div className="space-y-3 p-6">
            {/* Title */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />

            {/* Excerpt */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Meta info */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

