import { getTranslations, getLocale } from "next-intl/server";
import { api } from "~/trpc/server";
import { SectionHeader } from "~/components/section-header";
import { CategoryCard } from "~/components/category-card";
import { SectionBackground } from "~/components/section-background";

export async function CategoriesSection() {
  // Get current locale
  const locale = await getLocale();
  
  // Fetch data and translations in parallel
  const [t, categories] = await Promise.all([
    getTranslations("HomePage.categories"),
    api.blog.categories.list({
      featured: true,
      locale, // Pass locale for translations
    }),
  ]);

  return (
    <section className="py-8 sm:py-12 md:py-16 relative">
      <SectionBackground variant="red" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <SectionHeader
          title={t("title")}
          linkText={t("linkText")}
          linkHref="/categories"
        />

        {categories.length > 0 ? (
          <CategoryCard categories={categories} />
        ) : (
          <div className="rounded-lg border border-border/40 bg-card/50 p-12 text-center backdrop-blur">
            <p className="text-lg text-muted-foreground">{t("noCategories")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
