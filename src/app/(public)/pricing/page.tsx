"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Decimal } from "decimal.js";
import { PageWrapper } from "~/components/page-wrapper";
import { Badge } from "~/components/ui/badge";

export default function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: plans, isLoading: isPlansLoading } = api.subscriptions.plans.list.useQuery({
    isActive: true,
  });

  const { data: currentSubscription } = 
    api.subscriptions.subscriptions.myCurrent.useQuery(undefined, {
      enabled: !!session,
    });

  const handleSubscribe = (planId: string) => {
    if (status !== "authenticated" || !session) {
      router.push(`/auth/sign-in?callbackUrl=/checkout?plan=${planId}`);
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

  if (isPlansLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="border-b border-border/40 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Простые и прозрачные тарифы</h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Выберите план, который подходит именно вам
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans?.items.map((plan) => {
            const isCurrentPlan = currentSubscription?.planId === plan.id;
            const price = new Decimal(plan.price).toNumber();
            const isPopular = plan.slug === "advanced";

            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur ${
                  isCurrentPlan 
                    ? "border-primary shadow-lg shadow-primary/20" 
                    : isPopular 
                      ? "border-primary/50 shadow-lg shadow-primary/10" 
                      : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && !isCurrentPlan && (
                  <div className="absolute right-4 top-4 z-10">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Популярный
                    </Badge>
                  </div>
                )}
                
                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute right-4 top-4 z-10">
                    <Badge variant="outline" className="gap-1 border-primary text-primary">
                      <Check className="h-3 w-3" />
                      Текущий
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {price > 0 
                        ? `${price} ${plan.currency}` 
                        : "Бесплатно"}
                    </span>
                    {plan.billingInterval && price > 0 && (
                      <span className="text-muted-foreground">
                        /{plan.billingInterval === "month" ? "мес" : 
                          plan.billingInterval === "year" ? "год" : "навсегда"}
                      </span>
                    )}
                  </div>
                  
                  {plan.trialDays > 0 && (
                    <p className="mb-4 text-sm text-primary">
                      Пробный период {plan.trialDays} дней
                    </p>
                  )}

                  <div className="space-y-3">
                    {plan.features.map((pf) => (
                      <div key={pf.id} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">
                          {pf.feature.name}
                          {pf.value && pf.feature.featureType !== "boolean" && (
                            <span className="text-muted-foreground ml-1">({pf.value})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan
                      ? "Текущий план"
                      : "Выбрать план"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Часто задаваемые вопросы</h2>
          <div className="mx-auto max-w-2xl space-y-6 text-left">
            <div>
              <h3 className="font-semibold mb-2">Как отменить подписку?</h3>
              <p className="text-muted-foreground text-sm">
                Вы можете отменить подписку в любое время в настройках аккаунта. 
                Подписка будет активна до конца оплаченного периода.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Можно ли изменить план?</h3>
              <p className="text-muted-foreground text-sm">
                Да, вы можете перейти на другой план в любое время. 
                При переходе на более дорогой план будет рассчитана пропорциональная доплата.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Какие способы оплаты принимаются?</h3>
              <p className="text-muted-foreground text-sm">
                Мы принимаем все основные банковские карты (Visa, Mastercard, МИР).
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
