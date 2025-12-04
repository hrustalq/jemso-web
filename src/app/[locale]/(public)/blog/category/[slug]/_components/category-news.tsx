import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { api } from "~/trpc/server";

interface CategoryNewsProps {
  categoryId: string;
}

export async function CategoryNews({ categoryId }: CategoryNewsProps) {
  // Get current locale and translations
  const locale = await getLocale();
  const t = await getTranslations("Blog.categoryNews");
  
  const { items: posts } = await api.blog.posts.list({
    page: 1,
    pageSize: 12,
    published: true,
    categoryId,
    locale, // Pass locale for translations
  });

  if (posts.length === 0) {
    return null;
  }

  // Get locale for date formatting
  const dateLocale = locale === "ru" ? "ru-RU" : "en-US";

  return (
    <section>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
          >
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden">
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
              <div className="mb-4 text-sm text-foreground/70">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(dateLocale)
                  : ""}
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mb-6 text-base text-foreground/80">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-foreground/70">
                <span>{t("views", { count: post.views })}</span>
                <span>•</span>
                <span>{t("comments", { count: post._count.comments })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

