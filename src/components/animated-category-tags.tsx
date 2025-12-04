"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Blog");
  
  return (
    <div className="mb-12">
      <h2 className="mb-4 text-xl font-bold uppercase tracking-tight">
        {t("categories")}
      </h2>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          className={`animate animate-scaleIn rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
            !currentCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/40 bg-card hover:border-primary hover:text-primary"
          }`}
        >
          {t("allPosts")}
        </Link>
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/blog/category/${category.slug}`}
            className={`animate animate-scaleIn rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 stagger-${Math.min(index + 2, 10)} ${
              currentCategory === category.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/40 bg-card hover:border-primary hover:text-primary"
            }`}
          >
            {category.name} ({category._count.posts})
          </Link>
        ))}
      </div>
    </div>
  );
}
