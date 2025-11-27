"use client";

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
  const { data: user, isLoading } = api.user.me.useQuery();
  const { data: plans } = api.subscriptions.plans.list.useQuery({
    page: 1,
    pageSize: 10,
    isActive: true,
  });

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
        <AlertDescription>Failed to load user data</AlertDescription>
      </Alert>
    );
  }

  const hasActiveSubscription = user.subscription?.status === "active";
  const isTrialing = user.subscription?.trialEndsAt
    ? new Date(user.subscription.trialEndsAt) > new Date()
    : false;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">Subscription Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage your subscription plan and billing
          </p>
        </div>
      </div>

      <Separator />

      {/* Current Subscription */}
      {hasActiveSubscription && user.subscription ? (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-semibold">
                  {user.subscription.planName}
                </h4>
                <Badge
                  variant={isTrialing ? "default" : "outline"}
                  className={
                    isTrialing
                      ? "bg-blue-600"
                      : user.subscription.status === "active"
                        ? "border-green-600 text-green-600"
                        : ""
                  }
                >
                  {isTrialing
                    ? "Trial"
                    : user.subscription.status.charAt(0).toUpperCase() +
                      user.subscription.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Your current plan
              </p>
            </div>
          </div>

          <Separator />

          {/* Subscription Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.subscription.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {user.subscription.endDate && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {isTrialing && user.subscription.trialEndsAt && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-600/10 p-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Trial Ends</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      user.subscription.trialEndsAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Auto-Renew</p>
                <p className="text-sm text-muted-foreground">
                  {user.subscription.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          {user.subscription.features.length > 0 && (
            <>
              <Separator />
              <div>
                <h5 className="mb-3 text-sm font-semibold">Plan Features</h5>
                <div className="grid gap-2">
                  {user.subscription.features.map((feature) => (
                    <div
                      key={feature.slug}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>
                        {feature.name}
                        {feature.value && feature.type !== "boolean" && (
                          <span className="ml-1 text-muted-foreground">
                            ({feature.value}
                            {feature.type === "numeric" && feature.slug.includes("storage")
                              ? "GB"
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
          <div className="flex gap-4">
            <Button variant="outline" disabled>
              Manage Billing
            </Button>
            <Button variant="outline" disabled>
              Cancel Subscription
            </Button>
          </div>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have an active subscription. Browse available plans
            below.
          </AlertDescription>
        </Alert>
      )}

      {/* Available Plans */}
      {plans && plans.items.length > 0 && (
        <>
          <div className="mt-8">
            <h4 className="text-lg font-semibold">Available Plans</h4>
            <p className="text-sm text-muted-foreground">
              Upgrade or change your subscription plan
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.items.map((plan) => {
              const isCurrentPlan =
                plan.slug === user.subscription?.planSlug;

              return (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-6 space-y-4 ${
                    isCurrentPlan
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="text-lg font-semibold">{plan.name}</h5>
                      {isCurrentPlan && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${plan.price.toString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{plan.billingInterval}
                    </span>
                  </div>

                  {plan.trialDays > 0 && (
                    <Badge variant="outline" className="w-fit">
                      {plan.trialDays} days free trial
                    </Badge>
                  )}

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      <>
                        Select Plan
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

