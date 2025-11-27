"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Calendar, BookOpen, Newspaper } from "lucide-react";
import { Button } from "~/components/ui/button";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AnimatedHeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

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

    // CTA Text animation
    tl.from(
      ".hero-cta-text",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Benefits grid animation (staggered cards)
    tl.from(
      ".hero-benefits > div",
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all",
      },
      "-=0.3"
    );

    // Buttons animation
    tl.from(
      ".hero-buttons",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.2"
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="p-6 sm:p-8 md:p-12 lg:p-16 text-center"
    >
      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{ perspective: "1000px" }}
        >
          JEMSO DRIVE
        </h1>
        
        {/* Accent Line */}
        <div className="flex justify-center">
          <div
            ref={accentLineRef}
            className="h-1 w-32 bg-linear-to-r from-transparent via-primary to-transparent sm:w-48"
          />
        </div>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-foreground/80 sm:text-lg md:text-xl px-2"
        >
          Эмоция, которую ты испытываешь находясь в центре автомобильной культуры
        </p>

        {/* Platform Description */}
        <div className="hero-cta-text mx-auto max-w-3xl space-y-3 px-2">
          <p className="text-sm leading-relaxed text-foreground/70 sm:text-base md:text-lg">
            JEMSO Drive — это платформа для энтузиастов автоспорта и дрифта. 
            Мы организуем трек-дни, соревнования и встречи, создаём образовательный 
            контент и объединяем людей, которые живут автомобильной культурой.
          </p>
          <p className="text-xs leading-relaxed text-foreground/60 sm:text-sm md:text-base">
            От профессиональных гонщиков до начинающих любителей — каждый найдёт 
            что-то для себя. Присоединяйтесь к сообществу, участвуйте в событиях 
            и получайте доступ к эксклюзивным материалам.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="hero-benefits mx-auto grid max-w-3xl gap-3 sm:gap-4 pt-2 opacity-100 grid-cols-1 sm:grid-cols-3">
          <div className="group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 opacity-100 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">Образовательный контент</h3>
            <p className="text-xs text-foreground/60">Видео, статьи, гайды по дрифту и автоспорту</p>
          </div>

          <div className="group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 opacity-100 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">Мероприятия</h3>
            <p className="text-xs text-foreground/60">Трек-дни, соревнования, встречи участников</p>
          </div>

          <div className="group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 opacity-100 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">Сообщество</h3>
            <p className="text-xs text-foreground/60">Нетворкинг с гонщиками и энтузиастами</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="hero-buttons flex flex-wrap items-center justify-center gap-3 pt-6">
          <Button size="default" className="h-10 px-5 text-sm font-medium" asChild>
            <Link href="/categories">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Контент
            </Link>
          </Button>
          <Button size="default" variant="outline" className="h-10 px-5 text-sm font-medium" asChild>
            <Link href="/events">
              <Calendar className="mr-1.5 h-4 w-4" />
              События
            </Link>
          </Button>
          <Button size="default" variant="outline" className="h-10 px-5 text-sm font-medium" asChild>
            <Link href="/blog">
              <Newspaper className="mr-1.5 h-4 w-4" />
              Блог
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

