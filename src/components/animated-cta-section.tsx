"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AnimatedCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    let floatingAnim: gsap.core.Tween | null = null;
    let shimmerAnim: gsap.core.Tween | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none none",
        onEnter: () => {
          scrollTriggerInstance = ScrollTrigger.getById(timeline.scrollTrigger?.vars.id ?? "") ?? null;
        },
      },
    });

    timeline
      .from(".cta-badge", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
      .from(
        ".cta-title",
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .from(
        ".cta-description",
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .from(
        ".cta-buttons",
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.2"
      );

    // Intersection Observer for infinite animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start infinite animations when visible
            if (!floatingAnim) {
              floatingAnim = gsap.to(".cta-badge", {
                y: -10,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            } else {
              floatingAnim.resume();
            }

            if (!shimmerAnim) {
              shimmerAnim = gsap.to(".cta-shimmer", {
                x: "200%",
                duration: 3,
                repeat: -1,
                ease: "power2.inOut",
                repeatDelay: 2,
              });
            } else {
              shimmerAnim.resume();
            }
          } else {
            // Pause infinite animations when off-screen
            floatingAnim?.pause();
            shimmerAnim?.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      timeline.kill();
      floatingAnim?.kill();
      shimmerAnim?.kill();
      scrollTriggerInstance?.kill();
    };
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-linear-to-br from-primary/20 via-primary/10 to-background p-12 text-center md:p-16"
    >
      {/* Fixed Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 rounded-3xl bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2940&auto=format&fit=crop')",
            backgroundAttachment: "fixed",
          }}
        />
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      {/* Shimmer effect */}
      <div className="cta-shimmer absolute left-0 top-0 z-0 h-full w-1/3 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        {/* Badge */}
        <div className="cta-badge inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur">
          <Sparkles className="h-4 w-4" />
          Присоединяйтесь к JEMSO
        </div>

        {/* Title */}
        <h2 className="cta-title text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
          Начните своё путешествие
          <br />
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            в мир автоспорта
          </span>
        </h2>

        {/* Description */}
        <p className="cta-description mx-auto max-w-2xl text-lg font-medium text-foreground/80 md:text-xl">
          Зарегистрируйтесь, чтобы получить доступ к эксклюзивному контенту,
          участвовать в мероприятиях и стать частью сообщества JEMSO Drive.
        </p>

        {/* Buttons */}
        <div className="cta-buttons flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="group h-14 px-8 text-lg font-semibold" asChild>
            <Link href="/auth/sign-up">
              Зарегистрироваться
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold" asChild>
            <Link href="/auth/sign-in">Войти в аккаунт</Link>
          </Button>
        </div>

        {/* Small text */}
        <p className="text-sm font-medium text-foreground/70">
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Войдите здесь
          </Link>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 z-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
    </section>
  );
}

