"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PageLoaderProps {
  variant?: "default" | "minimal";
}

export function PageLoader({ variant = "default" }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const barsContainer = barsRef.current;
    
    if (!loader || !barsContainer) return;

    const bars = barsContainer.children;

    // Animate bars in sequence
    gsap.to(bars, {
      scaleY: 0.3,
      duration: 0.6,
      stagger: {
        each: 0.15,
        repeat: -1,
        yoyo: true,
      },
      ease: "power2.inOut",
    });

    // Pulse the container
    gsap.to(loader, {
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(bars);
      gsap.killTweensOf(loader);
    };
  }, []);

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center py-12">
        <div ref={loaderRef} className="flex items-center gap-1.5">
          <div
            ref={barsRef}
            className="flex items-end gap-1"
          >
            <div className="h-8 w-1 bg-primary" />
            <div className="h-8 w-1 bg-primary" />
            <div className="h-8 w-1 bg-primary" />
            <div className="h-8 w-1 bg-primary" />
            <div className="h-8 w-1 bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div ref={loaderRef} className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="text-4xl font-bold uppercase tracking-wider">
          JEMSO
        </div>

        {/* Animated bars */}
        <div
          ref={barsRef}
          className="flex items-end gap-1.5"
        >
          <div className="h-12 w-2 bg-primary" />
          <div className="h-12 w-2 bg-primary" />
          <div className="h-12 w-2 bg-primary" />
          <div className="h-12 w-2 bg-primary" />
          <div className="h-12 w-2 bg-primary" />
        </div>

        {/* Loading text */}
        <p className="text-sm text-muted-foreground">
          Загрузка...
        </p>
      </div>
    </div>
  );
}

