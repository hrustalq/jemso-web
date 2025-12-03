"use client";

import { useTranslations, useLocale } from "next-intl";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { 
  Newspaper, 
  Lock,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import { Link } from "~/i18n/navigation";
import Image from "next/image";

export default function UserNewsPage() {
  const t = useTranslations("Dashboard.newsPage");
  const locale = useLocale();
  const { data: user, isLoading: loadingUser } = api.user.me.useQuery();
  const { data: news, isLoading: loadingNews } = api.news.posts.list.useQuery({
    page: 1,
    pageSize: 50,
    published: true,
  });

  const isLoading = loadingUser || loadingNews;

  // Determine user tier from subscription
  const userTier = user?.subscription ? getTierFromPlan(user.subscription.planSlug) : 0;

  // Separate accessible and locked content
  const accessibleNews = news?.items.filter(item => (item.minTier ?? 0) <= userTier) ?? [];
  const lockedNews = news?.items.filter(item => (item.minTier ?? 0) > userTier) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("subtitle", { tier: userTier })}
        </p>
      </div>

      {/* User Tier Info */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {t("yourAccessLevel", { tier: userTier })}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.subscription 
                ? t("plan", { plan: user.subscription.planName })
                : t("subscribeHint")
              }
            </p>
          </div>
          {!user?.subscription && (
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
            >
              {t("upgrade")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Accessible News */}
      {accessibleNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            {t("accessibleNews")} ({accessibleNews.length})
          </h2>
          <div className="space-y-4">
            {accessibleNews.map((item) => (
              <NewsCard key={item.id} news={item} isAccessible locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Locked News Preview */}
      {lockedNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            {t("premiumNews")} ({lockedNews.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("upgradeHint")}
          </p>
          <div className="space-y-4">
            {lockedNews.slice(0, 3).map((item) => (
              <NewsCard key={item.id} news={item} isAccessible={false} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {accessibleNews.length === 0 && lockedNews.length === 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="py-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">{t("noNews")}</h3>
            <p className="text-muted-foreground">
              {t("noNewsHint")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    minTier: number;
    publishedAt: Date | null;
    createdAt: Date;
    category: { name: string; slug: string } | null;
  };
  isAccessible: boolean;
  locale: string;
}

function NewsCard({ news, isAccessible, locale }: NewsCardProps) {
  const content = (
    <Card className={`border-border/40 bg-card/50 backdrop-blur transition-all ${
      isAccessible ? "hover:shadow-lg hover:border-primary/50" : "opacity-60"
    }`}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Image */}
          {news.coverImage ? (
            <div className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
              <Image 
                src={news.coverImage} 
                alt={news.title}
                width={128}
                height={128}
                className={`object-cover w-full h-full ${!isAccessible ? "blur-sm" : ""}`}
              />
              {!isAccessible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg bg-muted flex items-center justify-center">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {news.category && (
                <Badge variant="secondary" className="text-xs">
                  {news.category.name}
                </Badge>
              )}
              {news.minTier > 0 && (
                <Badge variant="outline" className="text-xs">
                  Tier {news.minTier}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold line-clamp-2 mb-2">{news.title}</h3>
            {news.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2 hidden md:block">
                {news.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(news.publishedAt ?? news.createdAt).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isAccessible) {
    return (
      <Link href={`/news/${news.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function getTierFromPlan(planSlug: string): number {
  const tierMap: Record<string, number> = {
    "free": 0,
    "basic": 1,
    "advanced": 2,
    "vip": 3,
    "pro": 2,
  };
  return tierMap[planSlug.toLowerCase()] ?? 0;
}

