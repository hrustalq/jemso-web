"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn" | "blurIn";
  delay?: number;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = "fadeIn",
  delay = 0,
  threshold = 0.1,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            setTimeout(() => {
              switch (animation) {
                case "fadeIn":
                  gsap.from(element, {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                  break;
                case "slideInLeft":
                  gsap.from(element, {
                    opacity: 0,
                    x: -30,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                  break;
                case "slideInRight":
                  gsap.from(element, {
                    opacity: 0,
                    x: 30,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                  break;
                case "scaleIn":
                  gsap.from(element, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                  break;
                case "blurIn":
                  gsap.from(element, {
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 0.5,
                    ease: "power2.out",
                    clearProps: "filter",
                  });
                  break;
              }
            }, delay * 1000);

            observer.unobserve(element);
          }
        });
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animation, delay, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

