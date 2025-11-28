import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { HydrateClient } from "~/trpc/server";
import { CategoryHero } from "./_components/category-hero";
import { CategoryNews } from "./_components/category-news";
import { CategoryEvents } from "./_components/category-events";
import { CategoryNewsletterForm } from "~/components/category-newsletter-form";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

import { PageWrapper } from "~/components/page-wrapper";

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | JEMSO`,
    description:
      category.description ?? `Explore ${category.name} news, events, and more`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  return (
    <HydrateClient>
      <PageWrapper>
        <CategoryHero category={category} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-16">
            <CategoryNews categoryId={category.id} />
            <CategoryEvents categoryId={category.id} />
            
            {/* Category-specific Newsletter */}
            <section>
              <div className="mx-auto max-w-2xl">
                <CategoryNewsletterForm
                  categoryId={category.id}
                  categoryName={category.name}
                  categoryColor={category.color}
                />
              </div>
            </section>
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}

