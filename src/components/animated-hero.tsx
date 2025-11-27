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

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Title animation
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        }
      );
    }

    // Subtitle animation
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.3"
      );
    }

    // Description animation
    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.3"
      );
    }
  }, []);

  return (
    <section ref={heroRef} className="border-b border-border/40 pt-6 md:pt-[calc(var(--header-height)+var(--safe-top)+2rem)]">
      {/* Content */}
      <div className="text-center">
        <h1
          ref={titleRef}
          className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl"
          style={{ perspective: "1000px" }}
        >
          {title}
        </h1>
        
        <p
          ref={subtitleRef}
          className="text-xl font-bold text-primary"
        >
          {subtitle}
        </p>
        {description && (
          <p
            ref={descriptionRef}
            className="mt-2 text-lg text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

