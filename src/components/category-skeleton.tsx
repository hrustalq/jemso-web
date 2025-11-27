"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function CategorySkeleton() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".skeleton-card");
    if (cards.length === 0) return;

    // Simple fade-in only
    const tl = gsap.timeline();
    
    cards.forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 20 });
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, index * 0.1);
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={cardsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className="skeleton-card animate-pulse border-border bg-card p-6"
        >
          <div className="space-y-3">
            {/* Icon skeleton */}
            <Skeleton className="h-12 w-12 rounded-lg" />

            {/* Title skeleton */}
            <Skeleton className="h-6 w-32" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Badges skeleton */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

