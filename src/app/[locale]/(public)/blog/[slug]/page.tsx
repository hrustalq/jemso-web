import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import Image from "next/image";
import { BlocksRenderer } from "~/components/blocks/block-renderer";
import { isValidPostContent } from "~/lib/blocks/utils";
import type { Block } from "~/lib/blocks/types";
import { ArrowLeftIcon } from "lucide-react";

import { PageWrapper } from "~/components/page-wrapper";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await api.blog.posts.getBySlug({ slug });

    return {
      title: post.title,
      description: post.excerpt ?? `Читайте статью "${post.title}" на JEMSO. ${post.category ? `Категория: ${post.category.name}.` : ""}`,
      keywords: [
        "блог",
        "статья",
        "JEMSO",
        ...(post.category ? [post.category.name] : []),
        ...(post.tags.map((t) => t.tag.name)),
      ],
      authors: post.author?.name ? [{ name: post.author.name }] : undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? `Читайте статью "${post.title}" на JEMSO.`,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        authors: post.author?.name ? [post.author.name] : undefined,
        ...(post.coverImage && {
          images: [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt ?? `Читайте статью "${post.title}" на JEMSO.`,
        ...(post.coverImage && {
          images: [post.coverImage],
        }),
      },
    };
  } catch {
    return {
      title: "Статья не найдена",
      description: "Запрашиваемая статья не найдена.",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = await api.blog.posts.getBySlug({ slug });

    return (
      <HydrateClient>
        <PageWrapper withHeaderOffset={false} className="article-pt">
          <article>
            <div className="container mx-auto px-4 py-4 md:py-10">
              <div className="mx-auto max-w-4xl">
                {/* Back link */}
                <Link
                  href="/blog"
                  className="mb-8 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Назад к блогу
                </Link>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Meta */}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {post.publishedAt && (
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  <span>•</span>
                  <span>{post.views} просмотров</span>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>Автор: {post.author.name}</span>
                    </>
                  )}
                </div>

                {/* Category */}
                {post.category && (
                  <div className="mb-6">
                    <Link
                      href={`/blog/category/${post.category.slug}`}
                      className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold uppercase text-primary transition-colors hover:bg-primary/20"
                    >
                      {post.category.name}
                    </Link>
                  </div>
                )}

                {/* Title */}
                <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                {/* Content */}
                {post.blocks && isValidPostContent(post.blocks) ? (
                  <div className="prose prose-invert max-w-none">
                    <BlocksRenderer
                      blocks={(post.blocks as { version: string; blocks: Block[] }).blocks}
                    />
                  </div>
                ) : (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-8 border-t border-border/40 pt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Теги
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tagRelation) => (
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

                {/* Comments Section */}
                <div className="mt-8 border-t border-border/40 pt-8 pb-6 md:mt-12 md:pt-12 md:pb-10">
                  <h2 className="mb-6 text-xl font-bold uppercase tracking-tight sm:text-2xl">
                    Комментарии ({post.comments.length})
                  </h2>
                  
                  {post.comments.length > 0 ? (
                    <div className="space-y-6">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-border/40 bg-card p-6"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            {comment.author.image && (
                              <Image
                                src={comment.author.image}
                                alt={comment.author.name ?? "User"}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-semibold">
                                {comment.author.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "ru-RU",
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Пока нет комментариев. Будьте первым!
                    </p>
                  )}
                </div>
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

