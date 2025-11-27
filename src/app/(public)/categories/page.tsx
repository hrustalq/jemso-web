import { HydrateClient, api } from "~/trpc/server";
import { AnimatedCategoryCard } from "~/components/animated-category-card";
import { ScrollReveal } from "~/components/scroll-reveal";

export default async function CategoriesPage() {
  const categories = await api.blog.categories.list();

  return (
    <HydrateClient>
      <main className="min-h-(--content-height)" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="container mx-auto px-4 py-16">
        <ScrollReveal animation="fadeIn">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Направления
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Изучайте контент по направлениям: от дрифта и тюнинга до новостей
              автоспорта и технических обзоров.
            </p>
          </div>
        </ScrollReveal>

        {categories.length > 0 ? (
          <AnimatedCategoryCard categories={categories} />
        ) : (
          <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Направления пока не созданы.
            </p>
          </div>
        )}
        </div>
      </main>
    </HydrateClient>
  );
}

