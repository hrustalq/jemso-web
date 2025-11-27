"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeaderWrapperProps {
  children: React.ReactNode;
}

export function AnimatedHeaderWrapper({ children }: AnimatedHeaderWrapperProps) {
  useEffect(() => {
    const header = document.querySelector("header");
    const navBar = header?.querySelector("[data-nav-bar]") as HTMLElement | null;
    if (!header) return;

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let showAnim: gsap.core.Tween | null = null;

    // Initial header animation
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
        clearProps: "all",
      }
    );

    // Hide/show navigation bar on scroll
    if (navBar) {
      let lastScroll = 0;
      showAnim = gsap.fromTo(
        navBar,
        {
          height: navBar.offsetHeight,
          opacity: 1,
        },
        {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          paused: true,
        }
      );

      scrollTriggerInstance = ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          
          // Scrolling down and past 100px
          if (currentScroll > 100 && currentScroll > lastScroll) {
            showAnim?.play();
          } 
          // Scrolling up or at top
          else if (currentScroll < lastScroll || currentScroll < 50) {
            showAnim?.reverse();
          }
          
          lastScroll = currentScroll;
        },
      });
    }

    return () => {
      // Kill only this component's tweens and ScrollTrigger
      gsap.killTweensOf(header);
      if (navBar) {
        gsap.killTweensOf(navBar);
      }
      if (showAnim) {
        showAnim.kill();
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      
      // Ensure elements are in default state on cleanup
      if (header) {
        gsap.set(header, { clearProps: "all" });
      }
      if (navBar) {
        gsap.set(navBar, { clearProps: "all" });
      }
    };
  }, []);

  return <>{children}</>;
}

