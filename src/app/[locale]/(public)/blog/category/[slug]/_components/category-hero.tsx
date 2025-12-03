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
    <div className="border-b border-border/40 py-8 md:py-12">
      <div className="container mx-auto px-4 text-center">
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
        <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {category.name}
        </h1>

        {/* Description */}
        {category.description && (
          <p className="text-lg font-bold text-primary mb-4 sm:text-xl">
            {category.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground sm:gap-4">
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

