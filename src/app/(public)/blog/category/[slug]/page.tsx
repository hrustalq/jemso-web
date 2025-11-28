import { notFound } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { CategoryHero } from "./_components/category-hero";
import { CategoryNews } from "./_components/category-news";
import { CategoryUpcomingEvents } from "./_components/category-upcoming-events";
import { CategoryPastEvents } from "./_components/category-past-events";
import { PageWrapper } from "~/components/page-wrapper";
import type { Metadata } from "next";

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
      title: `${category.name} | JEMSO`,
      description:
        category.description ??
        `Explore ${category.name} news, events, and more on JEMSO`,
      openGraph: {
        title: `${category.name} | JEMSO`,
        description:
          category.description ??
          `Explore ${category.name} news, events, and more on JEMSO`,
      },
    };
  } catch {
    return {
      title: "Category Not Found | JEMSO",
      description: "The requested category could not be found",
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

