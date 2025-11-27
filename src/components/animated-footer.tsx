"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface AnimatedFooterWrapperProps {
  children: React.ReactNode;
}

export function AnimatedFooterWrapper({ children }: AnimatedFooterWrapperProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useGSAP(() => {
    if (!footerRef.current || hasAnimated.current) return;

    const footer = footerRef.current;
    const sections = footer.querySelectorAll(".footer-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Animate footer sections with stagger
            gsap.from(sections, {
              opacity: 0,
              y: 30,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
            });

            observer.unobserve(footer);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={footerRef}>{children}</div>;
}

