"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Decimal } from "decimal.js";
import { Badge } from "~/components/ui/badge";
import type { RouterOutputs } from "~/trpc/react";

type Plan = RouterOutputs["subscriptions"]["plans"]["list"]["items"][0];
type Subscription = RouterOutputs["subscriptions"]["subscriptions"]["myCurrent"];

interface PricingCardProps {
  plan: Plan;
  currentSubscription: Subscription | null;
}

export function PricingCard({ plan, currentSubscription }: PricingCardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isCurrentPlan = currentSubscription?.planId === plan.id;
  const price = new Decimal(plan.price).toNumber();
  const isPopular = plan.slug === "advanced";

  const handleSubscribe = (planId: string) => {
    if (status !== "authenticated" || !session) {
      router.push(`/auth/sign-in?callbackUrl=/checkout?plan=${planId}`);
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

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
            {price > 0 ? `${price} ${plan.currency}` : "Бесплатно"}
          </span>
          {plan.billingInterval && price > 0 && (
            <span className="text-muted-foreground">
              /{plan.billingInterval === "month"
                ? "мес"
                : plan.billingInterval === "year"
                  ? "год"
                  : "навсегда"}
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
              <Check className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm">
                {pf.feature.name}
                {pf.value && pf.feature.featureType !== "boolean" && (
                  <span className="ml-1 text-muted-foreground">({pf.value})</span>
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
          {isCurrentPlan ? "Текущий план" : "Выбрать план"}
        </Button>
      </CardFooter>
    </Card>
  );
}

