"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";

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

interface AnimatedCardGridProps {
  posts: BlogPost[];
  showTags?: boolean;
}

export function AnimatedCardGrid({ posts, showTags = false }: AnimatedCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".blog-card");
    gsap.from(cards, {
      opacity: 0,
      y: 30,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.06,
    });
  }, [posts]);

  return (
    <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          id={`card-${post.id}`}
          className="blog-card group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
        >
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-foreground/70">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("ru-RU")
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
              <span>{post.views} просмотров</span>
              <span>•</span>
              <span>{post._count.comments} комментариев</span>
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
}

