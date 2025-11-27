"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowRight } from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  coverImage: string | null;
  coverVideo: string | null;
  _count: {
    posts: number;
    events: number;
  };
}

interface AnimatedCategoryCardProps {
  categories: Category[];
}

export function AnimatedCategoryCard({ categories }: AnimatedCategoryCardProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".category-card");
    if (cards.length === 0) return;

    // Set initial state
    cards.forEach((card) => {
      gsap.set(card, { 
        opacity: 0, 
        y: 40,
        willChange: "transform, opacity"
      });
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top bottom-=50",
        once: true,
      },
    });

    // Animate each card
    cards.forEach((card, index) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(card, { willChange: "auto" });
        }
      }, index * 0.1);
    });

    return () => {
      tl.kill();
    };
  }, [categories]);

  const handleMouseEnter = (categoryId: string) => {
    const video = videoRefs.current.get(categoryId);
    if (video) {
      video.play().catch((err) => {
        console.log("Video play failed:", err);
      });
    }
  };

  const handleMouseLeave = (categoryId: string) => {
    const video = videoRefs.current.get(categoryId);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/categories/${category.slug}`}
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={() => handleMouseLeave(category.id)}
        >
          <Card className="category-card group relative h-[350px] sm:h-[400px] overflow-hidden border-border/40 bg-card transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 lg:hover:-translate-y-2">
            {/* Video/Image Background */}
            <div className="absolute inset-0">
              {category.coverVideo ? (
                <>
                  {/* Fallback image - shown by default */}
                  {category.coverImage && (
                    <Image
                      src={category.coverImage}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  )}
                  {/* Video for desktop hover - overlays on top */}
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current.set(category.id, el);
                      } else {
                        videoRefs.current.delete(category.id);
                      }
                    }}
                    src={category.coverVideo}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="hidden lg:block absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-90 z-1"
                  />
                </>
              ) : category.coverImage ? (
                <Image
                  src={category.coverImage}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={false}
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5"
                  style={category.color ? { background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}05 100%)` } : undefined}
                />
              )}
              
              {/* Gradient Overlay - ensures text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/30 lg:from-background lg:via-background/60 lg:to-background/20 transition-all duration-500 group-hover:from-background/95 group-hover:via-background/70 z-2" />
            </div>

            {/* Content */}
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8 z-10">
              {/* Stats Badges - Top */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 z-20">
                {category._count.posts > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="bg-background/95 backdrop-blur-md text-xs sm:text-sm font-medium shadow-xl border border-border/50"
                  >
                    {category._count.posts} статей
                  </Badge>
                )}
                {category._count.events > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="bg-background/95 backdrop-blur-md text-xs sm:text-sm font-medium shadow-xl border border-border/50"
                  >
                    {category._count.events} событий
                  </Badge>
                )}
              </div>

              {/* Category Info */}
              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:text-primary lg:group-hover:translate-x-2">
                  {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="line-clamp-2 sm:line-clamp-3 text-sm sm:text-base text-foreground/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:text-foreground">
                    {category.description}
                  </p>
                )}

                {/* CTA - visible on mobile, animated on desktop */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] opacity-100 lg:opacity-0 transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:translate-x-2">
                  <span>Узнать больше</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Color Accent Bar */}
            {category.color && (
              <div 
                className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: category.color }}
              />
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

