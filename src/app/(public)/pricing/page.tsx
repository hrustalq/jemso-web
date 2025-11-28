import type { Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { PageWrapper } from "~/components/page-wrapper";
import { PricingCard } from "./_components/pricing-card";

// ISR: Revalidate every 300 seconds (5 minutes) - plans change less frequently
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const plans = await api.subscriptions.plans.list({
    isActive: true,
  });

  return {
    title: "Тарифы",
    description: `Простые и прозрачные тарифы JEMSO. ${plans.items.length > 0 ? `Доступно ${plans.items.length} тарифных планов.` : ""} Выберите план, который подходит именно вам. Подписки открывают доступ к премиум контенту, эксклюзивным событиям и специальным предложениям.`,
    keywords: [
      "тарифы",
      "подписки",
      "планы",
      "JEMSO",
      "премиум контент",
      "эксклюзивные события",
      "автомобильный клуб",
    ],
    openGraph: {
      title: "Тарифы | JEMSO",
      description: "Простые и прозрачные тарифы JEMSO. Выберите план, который подходит именно вам.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Тарифы | JEMSO",
      description: "Простые и прозрачные тарифы JEMSO. Выберите план, который подходит именно вам.",
    },
  };
}

export default async function PricingPage() {
  // Fetch plans
  const plans = await api.subscriptions.plans.list({
    isActive: true,
  });

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="border-b border-border/40 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Простые и прозрачные тарифы
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Выберите план, который подходит именно вам
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.items.map((plan) => (
              <PricingCard key={plan.id} plan={plan} currentSubscription={null} />
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-16 text-center">
            <h2 className="mb-4 text-2xl font-bold">Часто задаваемые вопросы</h2>
            <div className="mx-auto max-w-2xl space-y-6 text-left">
              <div>
                <h3 className="mb-2 font-semibold">Как отменить подписку?</h3>
                <p className="text-sm text-muted-foreground">
                  Вы можете отменить подписку в любое время в настройках аккаунта.
                  Подписка будет активна до конца оплаченного периода.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Можно ли изменить план?</h3>
                <p className="text-sm text-muted-foreground">
                  Да, вы можете перейти на другой план в любое время. При переходе
                  на более дорогой план будет рассчитана пропорциональная доплата.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">
                  Какие способы оплаты принимаются?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Мы принимаем все основные банковские карты (Visa, Mastercard,
                  МИР).
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
