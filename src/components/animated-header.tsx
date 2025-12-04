"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "~/lib/utils";

interface AnimatedNavBarProps {
  children: React.ReactNode;
}

export function AnimatedNavBar({ children }: AnimatedNavBarProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const ticking = useRef(false);

  const updateNavState = useCallback(() => {
    const currentScroll = window.scrollY;

    // Scrolling down and past 100px - hide nav bar
    if (currentScroll > 100 && currentScroll > lastScrollRef.current) {
      setIsNavHidden(true);
    }
    // Scrolling up or at top - show nav bar
    else if (currentScroll < lastScrollRef.current || currentScroll < 50) {
      setIsNavHidden(false);
    }

    lastScrollRef.current = currentScroll;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for throttling
      if (!ticking.current) {
        requestAnimationFrame(updateNavState);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateNavState]);

  return (
    <div
      className={cn(
        "hidden md:block border-b border-border/40 overflow-hidden transition-all duration-300 ease-out",
        isNavHidden 
          ? "max-h-0 opacity-0 border-transparent" 
          : "max-h-20 opacity-100"
      )}
      data-nav-hidden={isNavHidden}
    >
      {children}
    </div>
  );
}
