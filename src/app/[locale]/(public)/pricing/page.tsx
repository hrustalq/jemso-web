import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HydrateClient, api } from "~/trpc/server";
import { PageWrapper } from "~/components/page-wrapper";
import { PricingCard } from "./_components/pricing-card";

// ISR: Revalidate every 300 seconds (5 minutes) - plans change less frequently
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
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
