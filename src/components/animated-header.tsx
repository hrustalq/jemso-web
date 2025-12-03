"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface AnimatedNavBarProps {
  children: React.ReactNode;
}

export function AnimatedNavBar({ children }: AnimatedNavBarProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
