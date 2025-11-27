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
    <div className="relative overflow-hidden border-b border-border/40 bg-linear-to-br from-background via-background/95 to-primary/5">
      {/* Decorative gradient orbs */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
        {/* Back Button */}
        <Link
          href="/blog"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all hover:text-primary md:mb-8 md:text-base"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 md:h-5 md:w-5" />
          <span>Назад к блогу</span>
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          {/* Title and Description */}
          <div className="flex-1">
            <h1 className="mb-3 text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-3 md:flex-col md:gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm md:px-6 md:py-3">
              <FileText className="h-4 w-4 text-primary md:h-5 md:w-5" />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground md:text-2xl">
                  {category._count.posts}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  статей
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm md:px-6 md:py-3">
              <Calendar className="h-4 w-4 text-primary md:h-5 md:w-5" />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground md:text-2xl">
                  {category._count.events}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  событий
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

