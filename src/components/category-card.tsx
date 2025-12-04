"use client";

import { useRef, useCallback, memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

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

interface CategoryCardProps {
  categories: Category[];
}

export const CategoryCard = memo(function CategoryCard({ categories }: CategoryCardProps) {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const handleMouseEnter = useCallback((categoryId: string) => {
    const video = videoRefs.current.get(categoryId);
    if (video) {
      video.play().catch((err) => {
        console.log("Video play failed:", err);
      });
    }
  }, []);

  const handleMouseLeave = useCallback((categoryId: string) => {
    const video = videoRefs.current.get(categoryId);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  // Memoize color styles to prevent inline object recreation
  const getColorStyle = useMemo(() => {
    const cache = new Map<string | null, React.CSSProperties>();
    return (color: string | null, isBackground = false) => {
      const key = `${color}-${isBackground}`;
      if (!cache.has(key)) {
        if (isBackground && color) {
          cache.set(key, {
            background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
          });
        } else {
          cache.set(key, { backgroundColor: color ?? 'hsl(var(--primary))' });
        }
      }
      return cache.get(key)!;
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={() => handleMouseLeave(category.id)}
          className={`animate animate-fadeInUp stagger-${index + 1} group flex flex-col w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5rem)] xl:w-[calc(16.666%-0.5rem)]`}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/50 ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
            {category.coverVideo ? (
              <>
                {/* Fallback image */}
                {category.coverImage && (
                  <Image
                    src={category.coverImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover"
                    priority={false}
                  />
                )}
                {/* Video for desktop hover */}
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
                  preload="none"
                  className="hidden lg:block absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </>
            ) : category.coverImage ? (
              <Image
                src={category.coverImage}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={false}
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={category.color ? getColorStyle(category.color, true) : undefined}
              >
                {/* Placeholder icon or gradient */}
                <div 
                  className="h-12 w-12 rounded-lg opacity-40"
                  style={getColorStyle(category.color)}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-3 text-center text-sm font-medium text-foreground/90 transition-colors duration-300 group-hover:text-foreground sm:text-base">
            {category.name}
          </h3>
        </Link>
      ))}
    </div>
  );
});

