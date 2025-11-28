import { notFound } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { CategoryHero } from "./_components/category-hero";
import { CategoryNews } from "./_components/category-news";
import { CategoryUpcomingEvents } from "./_components/category-upcoming-events";
import { CategoryPastEvents } from "./_components/category-past-events";
import { PageWrapper } from "~/components/page-wrapper";
import type { Metadata } from "next";

// ISR: Revalidate every 300 seconds (5 minutes) - categories change less frequently
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await api.blog.categories.get({ slug });

    return {
      title: category.name,
      description:
        category.description ??
        `Изучайте контент по направлению "${category.name}": новости, события и статьи на JEMSO.`,
      keywords: [
        "направление",
        "категория",
        "блог",
        "JEMSO",
        category.name,
      ],
      openGraph: {
        title: `${category.name} | JEMSO`,
        description:
          category.description ??
          `Изучайте контент по направлению "${category.name}": новости, события и статьи на JEMSO.`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${category.name} | JEMSO`,
        description:
          category.description ??
          `Изучайте контент по направлению "${category.name}" на JEMSO.`,
      },
    };
  } catch {
    return {
      title: "Направление не найдено",
      description: "Запрашиваемое направление не найдено.",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    const category = await api.blog.categories.get({ slug });

    return (
      <HydrateClient>
        <PageWrapper>
          <CategoryHero category={category} />

          <div className="container mx-auto px-4 py-10 md:px-6 lg:px-8">
            <div className="space-y-16">
              {/* News Section */}
              <CategoryNews categoryId={category.id} />

              {/* Upcoming Events Section */}
              <CategoryUpcomingEvents categoryId={category.id} />

              {/* Past Events Section */}
              <CategoryPastEvents categoryId={category.id} />
            </div>
          </div>
        </PageWrapper>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}

