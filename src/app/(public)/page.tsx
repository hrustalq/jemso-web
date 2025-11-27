import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { HydrateClient, api } from "~/trpc/server";
import { AnimatedHero } from "~/components/animated-hero";
import { AnimatedCardGrid } from "~/components/animated-card-grid";
import { AnimatedSectionHeader } from "~/components/animated-section-header";
import { AnimatedPlanCard } from "~/components/animated-plan-card";
import { AnimatedShopPreview } from "~/components/animated-shop-preview";
import { AnimatedCTASection } from "~/components/animated-cta-section";
import { ScrollReveal } from "~/components/scroll-reveal";
import { Button } from "~/components/ui/button";
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
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <AnimatedHero
          title="JEMSO DRIVE"
          subtitle="Радость в движении Joy in Motion"
          description="Эмоция, которую ты испытываешь находясь в центре автомобильной культуры"
        />
        </section>

        {/* CTA Section */}
        <section className="min-h-screen snap-start flex items-center justify-center py-16">
          <div className="container mx-auto px-4 w-full">
            <AnimatedCTASection />
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
                  isPopular: plan.slug === "pro", // Mark "pro" plan as popular
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

        {/* Final CTA Section */}
        <section className="min-h-screen snap-start flex items-center justify-center pb-16 pt-8">
          <div className="container mx-auto px-4 w-full">
            <ScrollReveal animation="scaleIn">
              <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-linear-to-br from-primary/20 via-primary/10 to-background p-12 text-center backdrop-blur md:p-16">
                {/* Fixed Background Image Layer */}
                <div className="absolute inset-0 z-0">
                  <div 
                    className="absolute inset-0 rounded-3xl bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2883&auto=format&fit=crop')",
                      backgroundAttachment: "fixed",
                    }}
                  />
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 z-0 opacity-30">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-3xl space-y-6">
                  <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-5xl">
                    Готовы начать?
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg font-medium text-foreground/80 md:text-xl">
                    Присоединяйтесь к сообществу JEMSO и откройте для себя мир
                    автоспорта, дрифта и незабываемых впечатлений.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
                    <Button size="lg" className="group h-14 px-8 text-lg font-semibold" asChild>
                      <Link href="/auth/sign-up">
                        Начать сейчас
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold" asChild>
                      <Link href="/contact">
                        <Mail className="mr-2 h-5 w-5" />
                        Связаться с нами
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 z-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
