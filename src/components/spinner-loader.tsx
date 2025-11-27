"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function SpinnerLoader() {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spinnerRef.current || !circleRef.current) return;

    // Rotate animation
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    // Scale pulse animation
    gsap.to(circleRef.current, {
      scale: 1.1,
      opacity: 0.6,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(spinnerRef.current);
      gsap.killTweensOf(circleRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-12 w-12">
        <div
          ref={circleRef}
          className="absolute inset-0 rounded-full border-2 border-primary/20"
        />
        <div
          ref={spinnerRef}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
        />
      </div>
    </div>
  );
}

