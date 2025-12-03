"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Sparkles } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";

interface Feature {
  feature: {
    id: string;
    name: string;
    slug: string;
    featureType: string;
  };
  value: string | null;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  billingInterval: string;
  trialDays: number | null;
  isPopular?: boolean;
  features: Feature[];
}

interface PlanCardProps {
  plans: Plan[];
  currentPlanId?: string | null;
}

export function PlanCard({ plans, currentPlanId: propCurrentPlanId }: PlanCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch current subscription if user is authenticated and no currentPlanId prop provided
  const { data: currentSubscription } = api.subscriptions.subscriptions.myCurrent.useQuery(
    undefined,
    {
      enabled: typeof window !== "undefined" && !!session && propCurrentPlanId === undefined,
    }
  );

  // Use prop or fetched subscription
  const currentPlanId = propCurrentPlanId ?? currentSubscription?.planId ?? null;

  const handlePlanSelect = (plan: Plan) => {
    // If not authenticated, redirect to login
    if (status !== "authenticated" || !session) {
      router.push(`/auth/sign-in?callbackUrl=/checkout?plan=${plan.id}`);
      return;
    }

    // If user is authenticated, go to checkout
    router.push(`/checkout?plan=${plan.id}`);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBillingText = (interval: string) => {
    const map: Record<string, string> = {
      month: "в месяц",
      year: "в год",
      lifetime: "навсегда",
    };
    return map[interval] ?? interval;
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`animate animate-fadeInUp stagger-${index + 1} card-hover relative flex h-full flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur ${
            plan.isPopular ? "border-primary shadow-lg shadow-primary/20" : ""
          }`}
        >
          {/* Popular Badge */}
          {plan.isPopular && (
            <div className="absolute right-4 top-4 z-10">
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Sparkles className="h-3 w-3" />
                Популярный
              </Badge>
            </div>
          )}

          <div className="flex flex-1 flex-col p-8">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              {plan.description && (
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                <span className="text-muted-foreground">
                  {getBillingText(plan.billingInterval)}
                </span>
              </div>
              {plan.trialDays && plan.trialDays > 0 && (
                <p className="text-sm text-primary">
                  Пробный период {plan.trialDays} дней
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">
                    {feature.feature.name}
                    {feature.value && feature.feature.featureType !== "boolean" && (
                      <span className="ml-1 font-semibold">
                        ({feature.value})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button - Always at bottom */}
            <div className="mt-6">
              {currentPlanId === plan.id ? (
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  disabled
                >
                  Текущий план
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="default"
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                >
                  Выбрать план
                </Button>
              )}
            </div>
          </div>

          {/* Background decoration for popular plan */}
          {plan.isPopular && (
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          )}
        </Card>
      ))}
    </div>
  );
}

