"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedHeaderWrapperProps {
  children: React.ReactNode;
}

export function AnimatedHeaderWrapper({ children }: AnimatedHeaderWrapperProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => {
      setIsInitialAnimationDone(true);
    }, 100);

    // Scroll handler for nav hide/show
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Scrolling down and past 100px
      if (currentScroll > 100 && currentScroll > lastScrollRef.current) {
        setIsNavHidden(true);
      }
      // Scrolling up or at top
      else if (currentScroll < lastScrollRef.current || currentScroll < 50) {
        setIsNavHidden(false);
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isInitialAnimationDone ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
      data-nav-hidden={isNavHidden}
    >
      {children}
    </div>
  );
}
