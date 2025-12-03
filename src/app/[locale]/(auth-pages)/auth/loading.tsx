"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AuthLoading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    // Fade in animation
    gsap.from(container, {
      opacity: 0,
      duration: 0.3,
    });

    // Card pulse animation
    gsap.to(card, {
      scale: 1.02,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(container);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-4 page-pt safe-pb backdrop-blur-sm"
    >
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-lg border border-border/40 bg-card p-8 shadow-lg"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
            JEMSO
          </h1>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-5">
          {/* Title skeleton */}
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          
          {/* Description skeleton */}
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted/60" />

          {/* Input skeletons */}
          <div className="space-y-3 pt-2">
            <div className="h-11 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-md bg-muted" />
          </div>

          {/* Button skeleton */}
          <div className="pt-2">
            <div className="h-11 w-full animate-pulse rounded-md bg-primary/20" />
          </div>

          {/* Footer skeleton */}
          <div className="flex justify-center pt-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

