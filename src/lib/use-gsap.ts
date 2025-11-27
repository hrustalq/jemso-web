"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Hook for fade in animation on mount
 */
export function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power3.out",
      delay,
    });
  }, [delay]);

  return ref;
}

/**
 * Hook for slide in animation from left
 */
export function useSlideInLeft(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      x: -50,
      duration: 0.6,
      ease: "power3.out",
      delay,
    });
  }, [delay]);

  return ref;
}

/**
 * Hook for slide in animation from right
 */
export function useSlideInRight(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      x: 50,
      duration: 0.6,
      ease: "power3.out",
      delay,
    });
  }, [delay]);

  return ref;
}

/**
 * Hook for scale in animation
 */
export function useScaleIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "back.out(1.7)",
      delay,
    });
  }, [delay]);

  return ref;
}

/**
 * Hook for stagger children animation
 */
export function useStaggerChildren(childSelector: string, delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const children = ref.current.querySelectorAll(childSelector);
    gsap.from(children, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.1,
      delay,
    });
  }, [childSelector, delay]);

  return ref;
}

/**
 * Hook for floating animation
 */
export function useFloating() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: "-=20",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return ref;
}

/**
 * Hook for blur in animation
 */
export function useBlurIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      filter: "blur(20px)",
      duration: 0.8,
      ease: "power3.out",
      delay,
      clearProps: "filter",
    });
  }, [delay]);

  return ref;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(
  animationType: "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn" = "fadeIn",
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            switch (animationType) {
              case "fadeIn":
                gsap.from(element, {
                  opacity: 0,
                  y: 30,
                  duration: 0.6,
                  ease: "power3.out",
                });
                break;
              case "slideInLeft":
                gsap.from(element, {
                  opacity: 0,
                  x: -50,
                  duration: 0.6,
                  ease: "power3.out",
                });
                break;
              case "slideInRight":
                gsap.from(element, {
                  opacity: 0,
                  x: 50,
                  duration: 0.6,
                  ease: "power3.out",
                });
                break;
              case "scaleIn":
                gsap.from(element, {
                  opacity: 0,
                  scale: 0.8,
                  duration: 0.6,
                  ease: "back.out(1.7)",
                });
                break;
            }
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animationType]);

  return ref;
}

