import Link from "next/link";
import Image from "next/image";
import { HydrateClient, api } from "~/trpc/server";

export default async function NewsPage() {
  // Fetch latest published posts
  const posts = await api.blog.posts.list({
    page: 1,
    pageSize: 10,
    published: true,
  });

  return (
    <HydrateClient>
      <main className="min-h-(--content-height)" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 bg-linear-to-b from-background to-background/95">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              НОВОСТИ
            </h1>
            <p className="text-xl font-bold text-primary">
              Последние события
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-5xl">
            {posts.items.length > 0 ? (
              <div className="space-y-8">
                {posts.items.map((post) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="md:flex">
                        {post.coverImage && (
                          <div className="aspect-video w-full overflow-hidden md:w-1/3">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={800}
                              height={450}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6">
                          <div className="mb-3 flex items-center gap-4 text-sm text-foreground/70">
                            <time>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString(
                                    "ru-RU",
                                  )
                                : ""}
                            </time>
                            {post.category && (
                              <>
                                <span>•</span>
                                <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold uppercase text-primary">
                                  {post.category.name}
                                </span>
                              </>
                            )}
                          </div>
                          <h2 className="mb-3 text-2xl font-bold text-foreground transition-colors hover:text-primary">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="mb-4 text-base text-foreground/80">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-foreground/70">
                            <span>{post.views} просмотров</span>
                            <span>•</span>
                            <span>{post._count.comments} комментариев</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Пока нет опубликованных новостей. Скоро здесь появятся
                  обновления!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}


