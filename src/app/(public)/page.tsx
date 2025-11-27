import { Suspense } from "react";
import { HydrateClient, api } from "~/trpc/server";
import { AnimatedHeroSection } from "~/components/animated-hero-section";
import { AnimatedCardGrid } from "~/components/animated-card-grid";
import { AnimatedSectionHeader } from "~/components/animated-section-header";
import { AnimatedPlanCard } from "~/components/animated-plan-card";
import { AnimatedShopPreview } from "~/components/animated-shop-preview";
import { ScrollReveal } from "~/components/scroll-reveal";
import { CategoriesSection } from "./_components/categories-section";
import { CategoriesSectionSkeleton } from "./_components/categories-section-skeleton";
import { EventsSection } from "./_components/events-section";
import { EventsSectionSkeleton } from "./_components/events-section-skeleton";

export default async function Home() {
  // Fetch data in parallel for better performance
  const [latestPosts, plans] = await Promise.all([
    api.blog.posts.list({
    page: 1,
    pageSize: 6,
    published: true,
    }),
    api.subscriptions.plans.list({
      page: 1,
      pageSize: 10,
      isActive: true,
    }),
  ]);

  return (
    <HydrateClient>
      <main className="snap-y snap-mandatory overflow-y-auto">
        {/* Hero Section */}
        <section className="min-h-screen snap-start flex items-center justify-center py-16" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
          <div className="container mx-auto px-4 w-full">
            <AnimatedHeroSection />
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
        <section className="min-h-screen snap-start flex items-center justify-center py-16">
          <div className="container mx-auto px-4 w-full">
            <ScrollReveal animation="slideInRight">
            <AnimatedSectionHeader
              title="Последние новости"
              linkText="Все статьи"
              linkHref="/blog"
            />
            </ScrollReveal>

            {latestPosts.items.length > 0 ? (
              <AnimatedCardGrid posts={latestPosts.items} />
            ) : (
              <div className="rounded-lg border border-border/40 bg-card p-12 text-center">
                <p className="text-lg text-foreground/80">
                  Пока нет опубликованных статей. Скоро здесь появятся новости!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Subscription Plans Section */}
        {plans.items.length > 0 && (
          <section className="min-h-screen snap-start flex items-center justify-center py-16">
            <div className="container mx-auto px-4 w-full">
              <ScrollReveal animation="scaleIn">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    Выберите свой план
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-foreground/80">
                    Подписки JEMSO открывают доступ к премиум контенту,
                    эксклюзивным событиям и специальным предложениям в магазине.
                    Выберите план, который подходит именно вам.
                  </p>
                </div>
              </ScrollReveal>

              <AnimatedPlanCard
                plans={plans.items.map((plan) => ({
                  ...plan,
                  price: Number(plan.price),
                  isPopular: plan.slug === "advanced", // Mark "advanced" plan as popular
                }))}
              />
            </div>
          </section>
        )}

        {/* Shop Section */}
        <section className="min-h-screen snap-start flex items-center justify-center py-16">
          <div className="container mx-auto px-4 w-full">
            <ScrollReveal animation="blurIn">
              <AnimatedSectionHeader
                title="Магазин JEMSO"
                linkText="В магазин"
                linkHref="/shop"
              />
            </ScrollReveal>

            <AnimatedShopPreview />
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
