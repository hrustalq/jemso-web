import { CategorySkeleton } from "~/components/category-skeleton";

export function CategoriesSectionSkeleton() {
  return (
    <section className="py-8 sm:py-12 md:py-16 relative">
      <div className="container mx-auto px-3 sm:px-4 w-full">
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-muted" />
        </div>

        <CategorySkeleton />
      </div>
    </section>
  );
}
