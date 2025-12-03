import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getLocale } from "next-intl/server";
import { api } from "~/trpc/server";

interface CategoryNewsProps {
  categoryId: string;
}

export async function CategoryNews({ categoryId }: CategoryNewsProps) {
  // Get current locale
  const locale = await getLocale();
  
  const { items: posts } = await api.blog.posts.list({
    page: 1,
    pageSize: 6,
    published: true,
    categoryId,
    locale, // Pass locale for translations
  });

  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Последние новости</h2>
        <Link
          href={`/blog?category=${categoryId}`}
          className="text-sm text-primary hover:underline"
        >
          Смотреть все →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
          >
            {post.coverImage && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm">
                <span className="text-foreground/70">
                  {format(new Date(post.publishedAt ?? post.createdAt), "d MMM yyyy")}
                </span>
                {post._count.comments > 0 && (
                  <>
                    <span className="text-foreground/70">•</span>
                    <span className="text-foreground/70">
                      {post._count.comments} комментариев
                    </span>
                  </>
                )}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground line-clamp-2 transition-colors group-hover:text-primary">{post.title}</h3>
              {post.excerpt && (
                <p className="line-clamp-2 text-base text-foreground/80">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

