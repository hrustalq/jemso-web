"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

interface AnimatedCategoryTagsProps {
  categories: Category[];
  currentCategory?: string;
}

export function AnimatedCategoryTags({
  categories,
  currentCategory,
}: AnimatedCategoryTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tags = containerRef.current.querySelectorAll(".category-tag");
    gsap.from(tags, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.05,
    });
  }, [categories]);

  const handleTagHover = (tagId: string, isEntering: boolean) => {
    const tag = document.getElementById(`tag-${tagId}`);
    if (!tag) return;

    if (isEntering) {
      gsap.to(tag, {
        scale: 1.05,
        y: -2,
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(tag, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="mb-12">
      <h2 className="mb-4 text-xl font-bold uppercase tracking-tight">
        Категории
      </h2>
      <div ref={containerRef} className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          id="tag-all"
          className={`category-tag rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
            !currentCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/40 bg-card hover:border-primary hover:text-primary"
          }`}
          onMouseEnter={() => handleTagHover("all", true)}
          onMouseLeave={() => handleTagHover("all", false)}
        >
          Все статьи
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/category/${category.slug}`}
            id={`tag-${category.id}`}
            className={`category-tag rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
              currentCategory === category.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/40 bg-card hover:border-primary hover:text-primary"
            }`}
            onMouseEnter={() => handleTagHover(category.id, true)}
            onMouseLeave={() => handleTagHover(category.id, false)}
          >
            {category.name} ({category._count.posts})
          </Link>
        ))}
      </div>
    </div>
  );
}

