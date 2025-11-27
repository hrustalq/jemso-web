import Link from "next/link";
import { HydrateClient, api } from "~/trpc/server";
import { AnimatedHero } from "~/components/animated-hero";
import { AnimatedCardGrid } from "~/components/animated-card-grid";
import { AnimatedCategoryTags } from "~/components/animated-category-tags";

export default async function BlogPage() {
  // Fetch all published posts and categories
  const [posts, categories] = await Promise.all([
    api.blog.posts.list({
      page: 1,
      pageSize: 12,
      published: true,
    }),
    api.blog.categories.list(),
  ]);

  return (
    <HydrateClient>
      <main className="min-h-(--content-height)" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <AnimatedHero
          title="БЛОГ"
          subtitle="Истории, инсайты и новости"
        />

        <div className="container mx-auto px-4 py-16">
          {/* Categories */}
          {categories.length > 0 && (
            <AnimatedCategoryTags categories={categories} />
          )}

          {/* Blog Posts */}
          {posts.items.length > 0 ? (
            <AnimatedCardGrid posts={posts.items} showTags={true} />
          ) : (
            <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Пока нет опубликованных статей
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Скоро здесь появятся интересные материалы!
              </p>
              <div className="rounded-lg border border-border/40 bg-card p-8">
                <h3 className="mb-4 text-xl font-bold text-foreground">
                  Следите за нашим контентом
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Подписывайтесь на наш YouTube канал для освещения
                  мероприятий, закулисного контента и видео об автомобильном
                  образе жизни.
                </p>
                <a
                  href="https://www.youtube.com/@jemsodrive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-primary px-6 py-3 font-semibold uppercase text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Наш YouTube канал
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
      </main>
    </HydrateClient>
  );
}

