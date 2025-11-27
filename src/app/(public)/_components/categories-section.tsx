import { api } from "~/trpc/server";
import { AnimatedSectionHeader } from "~/components/animated-section-header";
import { AnimatedCategoryCard } from "~/components/animated-category-card";
import { ScrollReveal } from "~/components/scroll-reveal";

export async function CategoriesSection() {
  const categories = await api.blog.categories.list({
    featured: true,
  });

  return (
    <section className="min-h-screen snap-start flex items-center justify-center py-16">
      <div className="container mx-auto px-4 w-full">
        <ScrollReveal animation="fadeIn">
          <AnimatedSectionHeader
            title="Направления"
            linkText="Все направления"
            linkHref="/categories"
          />
        </ScrollReveal>

        {categories.length > 0 ? (
          <AnimatedCategoryCard categories={categories} />
        ) : (
          <div className="rounded-lg border border-border/40 bg-card/50 p-12 text-center backdrop-blur">
            <p className="text-lg text-muted-foreground">
              Направления скоро появятся. Следите за обновлениями!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

