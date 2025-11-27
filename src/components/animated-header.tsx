"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

interface AnimatedHeaderWrapperProps {
  children: React.ReactNode;
}

export function AnimatedHeaderWrapper({ children }: AnimatedHeaderWrapperProps) {
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    // Use fromTo for explicit control over start and end states
    // This ensures the header is always visible at the end
    gsap.fromTo(
      header,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all", // Clear inline styles after animation completes
      }
    );

    return () => {
      gsap.killTweensOf(header);
      // Ensure header is visible on cleanup
      if (header) {
        gsap.set(header, { clearProps: "all" });
      }
    };
  }, []);

  return <>{children}</>;
}

