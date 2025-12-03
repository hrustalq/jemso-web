import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { HydrateClient, api } from "~/trpc/server";
import { CategoryCard } from "~/components/category-card";
import { PageWrapper } from "~/components/page-wrapper";

// ISR: Revalidate every 300 seconds (5 minutes) - categories change less frequently
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Categories" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
    },
  };
}

export default async function CategoriesPage() {
  // Get current locale
  const locale = await getLocale();
  const t = await getTranslations("Categories");
  const categories = await api.blog.categories.list({ locale }); // Pass locale for translations

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 md:py-12">
          {categories.length > 0 ? (
            <CategoryCard categories={categories} />
          ) : (
            <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
              <p className="text-lg text-muted-foreground">
                {t("noCategories")}
              </p>
            </div>
          )}
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
