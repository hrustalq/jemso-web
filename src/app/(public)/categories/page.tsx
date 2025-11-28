import type { Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { AnimatedCategoryCard } from "~/components/animated-category-card";
import { ScrollReveal } from "~/components/scroll-reveal";
import { PageWrapper } from "~/components/page-wrapper";

// ISR: Revalidate every 300 seconds (5 minutes) - categories change less frequently
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const categories = await api.blog.categories.list();
  const categoryNames = categories.map((cat) => cat.name).join(", ");

  return {
    title: "Направления",
    description: `Изучайте контент по направлениям: от дрифта и тюнинга до новостей автоспорта и технических обзоров. ${categoryNames ? `Доступные направления: ${categoryNames}.` : ""}`,
    keywords: [
      "автомобильные направления",
      "категории контента",
      "дрифт",
      "тюнинг",
      "автоспорт",
      "технические обзоры",
      ...categories.map((cat) => cat.name),
    ],
    openGraph: {
      title: "Направления | JEMSO",
      description: `Изучайте контент по направлениям: от дрифта и тюнинга до новостей автоспорта и технических обзоров.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Направления | JEMSO",
      description: `Изучайте контент по направлениям: от дрифта и тюнинга до новостей автоспорта и технических обзоров.`,
    },
  };
}

export default async function CategoriesPage() {
  const categories = await api.blog.categories.list();

  return (
    <HydrateClient>
      <PageWrapper>
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
      </PageWrapper>
    </HydrateClient>
  );
}

