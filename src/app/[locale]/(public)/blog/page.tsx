import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { HydrateClient, api } from "~/trpc/server";
import { CardGrid } from "~/components/card-grid";
import { AnimatedCategoryTags } from "~/components/animated-category-tags";
import { PageWrapper } from "~/components/page-wrapper";
import { Link } from "~/i18n/navigation";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

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

export default async function BlogPage() {
  // Get current locale
  const locale = await getLocale();
  const t = await getTranslations("Blog");
  
  // Fetch all published posts and categories
  const [posts, categories] = await Promise.all([
    api.blog.posts.list({
      page: 1,
      pageSize: 12,
      published: true,
      locale, // Pass locale for translations
    }),
    api.blog.categories.list({ locale }), // Pass locale for translations
  ]);

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Categories */}
          {categories.length > 0 && (
            <AnimatedCategoryTags categories={categories} />
          )}

          {/* Blog Posts */}
          {posts.items.length > 0 ? (
            <CardGrid posts={posts.items} showTags={true} />
          ) : (
            <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                {t("emptyStateTitle")}
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                {t("emptyStateText")}
              </p>
              <div className="rounded-lg border border-border/40 bg-card p-8">
                <h3 className="mb-4 text-xl font-bold text-foreground">
                  {t("followContentTitle")}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {t("followContentText")}
                </p>
                <a
                  href="https://www.youtube.com/@jemsodrive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-primary px-6 py-3 font-semibold uppercase text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t("youtubeChannel")}
                </a>
              </div>
            </div>
          )}

          {/* Pagination */}
          {posts.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`rounded-md px-4 py-2 font-semibold transition-colors ${
                      pageNum === posts.page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/40 hover:border-primary"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
