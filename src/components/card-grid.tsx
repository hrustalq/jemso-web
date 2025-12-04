"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  views: number;
  category: {
    id: string;
    name: string;
  } | null;
  _count: {
    comments: number;
  };
  tags?: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

interface CardGridProps {
  posts: BlogPost[];
  showTags?: boolean;
}

export const CardGrid = memo(function CardGrid({ posts, showTags = false }: CardGridProps) {
  const t = useTranslations("CardGrid");
  const locale = useLocale();
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          id={`card-${post.id}`}
          className={`animate animate-fadeInUp stagger-${index + 1} group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary`}
        >
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-foreground/70">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US")
                  : ""}
              </span>
              {post.category && (
                <span className="rounded-md bg-primary/10 px-3 py-1 font-semibold uppercase text-primary">
                  {post.category.name}
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mb-6 text-base text-foreground/80">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-foreground/70">
              <span>{post.views} {t("views")}</span>
              <span>•</span>
              <span>{post._count.comments} {t("comments")}</span>
            </div>
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tagRelation) => (
                  <span
                    key={tagRelation.tag.id}
                    className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/70"
                  >
                    #{tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
});

