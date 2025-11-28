import { CategorySkeleton } from "~/components/category-skeleton";

export function CategoriesSectionSkeleton() {
  return (
    <section className="snap-start flex items-center justify-center py-16 section-min-h-full">
      <div className="container mx-auto px-4 w-full">
        <div className="mb-12">
          <div className="mb-4 h-10 w-48 animate-pulse rounded-lg bg-muted" />
        </div>

        <CategorySkeleton />
      </div>
    </section>
  );
}

