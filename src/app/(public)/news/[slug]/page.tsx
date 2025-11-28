import Link from "next/link";
import { notFound } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";
import { PageWrapper } from "~/components/page-wrapper";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;

  try {
    const news = await api.news.posts.getBySlug({ slug });

    return (
      <HydrateClient>
        <PageWrapper withHeaderOffset={false} className="article-pt">
          <article>
            <div className="container mx-auto px-4 py-4 md:py-10">
              <div className="mx-auto max-w-4xl">
                {/* Back link */}
                <Link
                  href="/news"
                  className="mb-8 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" /> Назад к новостям
                </Link>

                {/* Cover Image */}
                {news.coverImage && (
                  <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={news.coverImage}
                      alt={news.title}
                      width={1200}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Meta */}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {news.publishedAt && (
                    <time>
                      {new Date(news.publishedAt).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  <span>•</span>
                  <span>{news.views} просмотров</span>
                  {news.author && (
                    <>
                      <span>•</span>
                      <span>Автор: {news.author.name}</span>
                    </>
                  )}
                </div>

                {/* Category */}
                {news.category && (
                  <div className="mb-6">
                    <span
                      className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold uppercase text-primary"
                    >
                      {news.category.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {news.title}
                </h1>

                {/* Excerpt */}
                {news.excerpt && (
                  <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                    {news.excerpt}
                  </p>
                )}

                {/* Content */}
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: news.htmlContent ?? news.content }}
                />

                {/* Tags */}
                {news.tags.length > 0 && (
                  <div className="mt-8 border-t border-border/40 pt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Теги
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tagRelation) => (
                        <span
                          key={tagRelation.tag.id}
                          className="rounded-md border border-border/40 bg-card px-3 py-1 text-sm font-semibold transition-colors hover:border-primary"
                        >
                          #{tagRelation.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        </PageWrapper>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}

