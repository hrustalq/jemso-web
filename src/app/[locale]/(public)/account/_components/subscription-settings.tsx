"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  CreditCard,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";

export function SubscriptionSettings() {
  const router = useRouter();
  const { data: user, isLoading } = api.user.me.useQuery();
  const { data: plans } = api.subscriptions.plans.list.useQuery({
    page: 1,
    pageSize: 10,
    isActive: true,
  });

  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Не удалось загрузить данные пользователя</AlertDescription>
      </Alert>
    );
  }

  const hasActiveSubscription = user.subscription?.status === "active" || user.subscription?.status === "trial";
  const isTrialing = user.subscription?.status === "trial" || (
    user.subscription?.trialEndsAt
      ? new Date(user.subscription.trialEndsAt) > new Date()
      : false
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-medium">Управление подпиской</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Управляйте тарифным планом и оплатой
          </p>
        </div>
      </div>

      <Separator />

      {/* Current Subscription */}
      {hasActiveSubscription && user.subscription ? (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg sm:text-xl font-semibold">
                  {user.subscription.planName}
                </h4>
                <Badge
                  variant={isTrialing ? "default" : "outline"}
                  className={`text-xs ${
                    isTrialing
                      ? "bg-blue-600"
                      : user.subscription.status === "active"
                        ? "border-green-600 text-green-600"
                        : ""
                  }`}
                >
                  {isTrialing
                    ? "Пробный период"
                    : user.subscription.status === "active"
                      ? "Активна"
                      : user.subscription.status.charAt(0).toUpperCase() +
                        user.subscription.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Ваш текущий план
              </p>
            </div>
          </div>

          <Separator />

          {/* Subscription Details */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-muted p-1.5 sm:p-2 shrink-0">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium">Дата начала</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {new Date(user.subscription.startDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>

            {user.subscription.endDate && (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-muted p-1.5 sm:p-2 shrink-0">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Дата окончания</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(user.subscription.endDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            )}

            {isTrialing && user.subscription.trialEndsAt && (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-blue-600/10 p-1.5 sm:p-2 shrink-0">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Конец пробного периода</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(
                      user.subscription.trialEndsAt
                    ).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-muted p-1.5 sm:p-2 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium">Автопродление</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user.subscription.autoRenew ? "Включено" : "Отключено"}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          {user.subscription.features.length > 0 && (
            <>
              <Separator />
              <div>
                <h5 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold">Функции плана</h5>
                <div className="grid gap-1.5 sm:gap-2">
                  {user.subscription.features.map((feature) => (
                    <div
                      key={feature.slug}
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                      <span className="min-w-0">
                        {feature.name}
                        {feature.value && feature.type !== "boolean" && (
                          <span className="ml-1 text-muted-foreground">
                            ({feature.value}
                            {feature.type === "numeric" && feature.slug.includes("storage")
                              ? "ГБ"
                              : ""})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button variant="outline" disabled className="text-xs sm:text-sm w-full sm:w-auto">
              Управление оплатой
            </Button>
            <Button variant="outline" disabled className="text-xs sm:text-sm w-full sm:w-auto">
              Отменить подписку
            </Button>
          </div>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4 shrink-0" />
          <AlertDescription className="text-xs sm:text-sm">
            У вас нет активной подписки. Просмотрите доступные планы ниже.
          </AlertDescription>
        </Alert>
      )}

      {/* Available Plans */}
      {plans && plans.items.length > 0 && (
        <>
          <div className="mt-6 sm:mt-8">
            <h4 className="text-base sm:text-lg font-semibold">Доступные планы</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Обновите или измените тарифный план
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.items.map((plan) => {
              const isCurrentPlan =
                plan.slug === user.subscription?.planSlug;

              return (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-4 sm:p-6 space-y-3 sm:space-y-4 ${
                    isCurrentPlan
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-base sm:text-lg font-semibold truncate">{plan.name}</h5>
                      {isCurrentPlan && (
                        <Badge variant="default" className="text-xs shrink-0">Текущий</Badge>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold">
                      ${plan.price.toString()}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      /{plan.billingInterval === "month" ? "месяц" : plan.billingInterval === "year" ? "год" : plan.billingInterval}
                    </span>
                  </div>

                  {plan.trialDays > 0 && (
                    <Badge variant="outline" className="w-fit text-xs">
                      {plan.trialDays} дней бесплатно
                    </Badge>
                  )}

                  <Button
                    className="w-full text-sm"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                  >
                    {isCurrentPlan ? (
                      "Текущий план"
                    ) : (
                      <>
                        Выбрать план
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

