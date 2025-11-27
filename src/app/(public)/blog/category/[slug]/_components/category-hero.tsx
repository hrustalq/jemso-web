import Link from "next/link";
import { ArrowLeft, FileText, Calendar } from "lucide-react";

interface CategoryHeroProps {
  category: {
    name: string;
    description: string | null;
    _count: {
      posts: number;
      events: number;
    };
  };
}

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <div className="border-b border-border/40 pt-6 md:pt-[calc(var(--header-height)+var(--safe-top)+2rem)]">
      <div className="container mx-auto px-4 pb-8 text-center">
        {/* Back Button */}
        <div className="mb-4 flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Назад к блогу</span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
          {category.name}
        </h1>

        {/* Description */}
        {category.description && (
          <p className="text-xl font-bold text-primary mb-4">
            {category.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{category._count.posts} статей</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{category._count.events} событий</span>
          </div>
        </div>
      </div>
    </div>
  );
}

