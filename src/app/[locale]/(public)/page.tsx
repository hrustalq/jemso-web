import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { api } from "~/trpc/server";
import { PromoBannerHero } from "~/components/promo-banner-hero";
import { CardGrid } from "~/components/card-grid";
import { SectionHeader } from "~/components/section-header";
import { PlanCard } from "~/components/plan-card";
import { ShopPreview } from "~/components/shop-preview";
import { SectionBackground } from "~/components/section-background";
import { PageWrapper } from "~/components/page-wrapper";
import { CategoriesSection } from "./_components/categories-section";
import { CategoriesSectionSkeleton } from "./_components/categories-section-skeleton";
import { EventsSection } from "./_components/events-section";
import { EventsSectionSkeleton } from "./_components/events-section-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Promo Banner Hero Skeleton
function PromoBannerHeroSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Main Banner Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/50">
        <div className="flex flex-col lg:flex-row">
          <Skeleton className="aspect-video lg:aspect-21/9 w-full lg:w-2/3" />
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:w-1/2">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-4 h-10 w-3/4 sm:h-12" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-6 h-4 w-2/3" />
            <div className="mb-6 flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Cards Skeleton */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex overflow-hidden rounded-xl border border-border/40 bg-card/50"
          >
            <Skeleton className="w-1/3 min-w-[120px] sm:min-w-[160px] aspect-4/3" />
            <div className="flex-1 p-4 sm:p-5">
              <Skeleton className="mb-1 h-3 w-20" />
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="mb-2 h-4 w-2/3" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// News Section Skeleton
function NewsSectionSkeleton() {
  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Plans Section Skeleton
function PlansSectionSkeleton() {
  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <div className="mb-8 sm:mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-64 mb-4" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-8 rounded-lg border border-border/40 bg-card/50"
            >
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-6" />
              <Skeleton className="h-12 w-40 mb-6" />
              <div className="space-y-3 mb-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Shop Section Skeleton
function ShopSectionSkeleton() {
  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
        </div>
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border/40 bg-card/50"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}

// Server components for each section
async function NewsSection() {
  const [t, latestPosts] = await Promise.all([
    getTranslations("HomePage"),
    api.blog.posts.list({
      page: 1,
      pageSize: 6,
      published: true,
    }),
  ]);

  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <SectionBackground variant="slate" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <SectionHeader
          title={t("news.title")}
          linkText={t("news.linkText")}
          linkHref="/blog"
        />

        {latestPosts.items.length > 0 ? (
          <CardGrid posts={latestPosts.items} />
        ) : (
          <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
            <p className="text-lg text-foreground/80">{t("news.noNews")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

async function PlansSection() {
  const [t, plans] = await Promise.all([
    getTranslations("HomePage"),
    api.subscriptions.plans.list({
      page: 1,
      pageSize: 10,
      isActive: true,
    }),
  ]);

  if (plans.items.length === 0) {
    return null;
  }

  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <SectionBackground variant="purple" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <div className="animate animate-scaleIn mb-8 sm:mb-12 text-center px-2">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
            {t("plans.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-foreground/80">
            {t("plans.subtitle")}
          </p>
        </div>

        <PlanCard
          plans={plans.items.map((plan) => ({
            ...plan,
            price: Number(plan.price),
            isPopular: plan.slug === "advanced",
          }))}
        />
      </div>
    </section>
  );
}

async function ShopSection() {
  const t = await getTranslations("HomePage");

  return (
    <section className="snap-start flex items-center justify-center py-8 sm:py-12 md:py-16 relative min-h-(--content-height)">
      <SectionBackground variant="pink" intensity="low" />
      <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
        <SectionHeader
          title={t("shop.title")}
          linkText={t("shop.linkText")}
          linkHref="/shop"
        />

        <ShopPreview />
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <PageWrapper className="snap-y snap-mandatory overflow-y-auto">
      {/* Promotional Banner Hero Section */}
      <section className="snap-start flex items-center justify-center py-6 sm:py-8 md:py-12 relative min-h-(--content-height)">
        <SectionBackground variant="multi" intensity="low" />
        <div className="container mx-auto px-3 sm:px-4 w-full relative z-10">
          <Suspense fallback={<PromoBannerHeroSkeleton />}>
            <PromoBannerHero />
          </Suspense>
        </div>
      </section>

      {/* Categories Section */}
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Upcoming Events Section */}
      <Suspense fallback={<EventsSectionSkeleton />}>
        <EventsSection />
      </Suspense>

      {/* News Section */}
      <Suspense fallback={<NewsSectionSkeleton />}>
        <NewsSection />
      </Suspense>

      {/* Subscription Plans Section */}
      <Suspense fallback={<PlansSectionSkeleton />}>
        <PlansSection />
      </Suspense>

      {/* Shop Section */}
      <Suspense fallback={<ShopSectionSkeleton />}>
        <ShopSection />
      </Suspense>
    </PageWrapper>
  );
}
