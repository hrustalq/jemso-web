"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedFooterWrapperProps {
  children: React.ReactNode;
}

export function AnimatedFooterWrapper({ children }: AnimatedFooterWrapperProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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

  return (
    <div
      ref={footerRef}
      className={`transition-all duration-600 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}
