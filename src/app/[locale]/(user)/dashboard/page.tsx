import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { api } from "~/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { 
  Calendar, 
  Newspaper, 
  BookOpen, 
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "~/i18n/navigation";

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-8 mb-2" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {  
  const t = await getTranslations("Dashboard");
  const locale = await getLocale();
  
  // Fetch user data and content in parallel
  const [user, myRegistrations, latestNews, latestPosts] = await Promise.all([
    api.user.me(),
    api.event.registrations.myRegistrations(),
    api.news.posts.list({ 
      page: 1, 
      pageSize: 5, 
      published: true,
    }),
    api.blog.posts.list({ 
      page: 1, 
      pageSize: 5, 
      published: true,
    }),
  ]);

  // Determine user tier from subscription
  const userTier = user.subscription ? getTierFromPlan(user.subscription.planSlug) : 0;

  // Filter upcoming events (confirmed and in the future)
  const now = new Date();
  const upcomingEvents = myRegistrations.filter(
    reg => reg.status === "confirmed" && new Date(reg.event.startDate) > now
  ).slice(0, 5);

  // Filter content by tier
  const accessibleNews = latestNews.items.filter(item => (item.minTier ?? 0) <= userTier);
  const accessiblePosts = latestPosts.items.filter(item => (item.minTier ?? 0) <= userTier);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("welcome", { name: user.name ?? t("user") })}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("welcomeSubtitle")}
        </p>
      </div>

      {/* Subscription Status */}
      {user.subscription ? (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{user.subscription.planName}</p>
                <p className="text-sm text-muted-foreground">
                  {user.subscription.status === "trial" ? t("subscription.trialPeriod") : t("subscription.activeSubscription")}
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-primary">
              Tier {userTier}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 bg-card/50">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold">{t("subscription.noSubscription")}</p>
              <p className="text-sm text-muted-foreground">
                {t("subscription.noSubscriptionHint")}
              </p>
            </div>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("subscription.choosePlan")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                <p className="text-sm text-muted-foreground">{t("stats.myEvents")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Newspaper className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{accessibleNews.length}</p>
                <p className="text-sm text-muted-foreground">{t("stats.availableNews")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{accessiblePosts.length}</p>
                <p className="text-sm text-muted-foreground">{t("stats.availableArticles")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Star className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Tier {userTier}</p>
                <p className="text-sm text-muted-foreground">{t("stats.accessLevel")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("upcomingEvents.title")}
              </CardTitle>
              <CardDescription>{t("upcomingEvents.description")}</CardDescription>
            </div>
            <Link 
              href="/dashboard/events" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {t("upcomingEvents.allEvents")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map((reg) => (
                  <Link
                    key={reg.id}
                    href={`/events/${reg.event.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{reg.event.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(reg.event.startDate).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {reg.status === "confirmed" ? t("upcomingEvents.confirmed") : reg.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t("upcomingEvents.noEvents")}</p>
                <Link 
                  href="/events" 
                  className="text-primary hover:underline text-sm"
                >
                  {t("upcomingEvents.viewAllEvents")}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest News */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                {t("latestNews.title")}
              </CardTitle>
              <CardDescription>{t("latestNews.description")}</CardDescription>
            </div>
            <Link 
              href="/dashboard/news" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {t("latestNews.allNews")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {accessibleNews.length > 0 ? (
              <div className="space-y-3">
                {accessibleNews.slice(0, 3).map((news) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Newspaper className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{news.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(news.publishedAt ?? news.createdAt).toLocaleDateString(locale)}
                      </p>
                    </div>
                    {(news.minTier ?? 0) > 0 && (
                      <Badge variant="secondary" className="shrink-0">
                        Tier {news.minTier}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t("latestNews.noNews")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to determine tier from plan slug
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

