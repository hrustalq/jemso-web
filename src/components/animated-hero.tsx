"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
  description?: string;
}

export function AnimatedHero({ title, subtitle, description }: AnimatedHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Split title into characters for staggered animation
    if (titleRef.current) {
      const chars = titleRef.current.textContent?.split("") || [];
      titleRef.current.innerHTML = chars
        .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
      
      const charElements = titleRef.current.querySelectorAll("span");
      
      tl.fromTo(
        charElements,
        {
          opacity: 0,
          y: 100,
          rotationX: -90,
          scale: 0.5,
          transformOrigin: "50% 50%",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: {
            each: 0.03,
            from: "start",
          },
        }
      );
    }

    // Accent line animation
    if (accentLineRef.current) {
      tl.fromTo(
        accentLineRef.current,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.6"
      );
    }

    // Subtitle with bounce effect
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );
    }

    // Description with fade and slide
    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section ref={heroRef} className="container mx-auto px-4 py-24 text-center">
      <h1
        ref={titleRef}
        className="mb-8 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl"
        style={{ perspective: "1000px" }}
      >
        {title}
      </h1>
      
      {/* Accent Line */}
      <div className="mb-8 flex justify-center">
        <div
          ref={accentLineRef}
          className="h-1 w-32 bg-linear-to-r from-transparent via-primary to-transparent sm:w-48"
        />
      </div>

      <p
        ref={subtitleRef}
        className="text-2xl font-bold uppercase tracking-wide text-foreground/90 sm:text-3xl"
      >
        {subtitle}
      </p>
      {description && (
        <p
          ref={descriptionRef}
          className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-relaxed text-foreground/80 sm:text-xl"
        >
          {description}
        </p>
      )}
    </section>
  );
}

