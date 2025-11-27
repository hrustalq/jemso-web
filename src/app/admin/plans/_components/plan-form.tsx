"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface PlanFormProps {
  plan?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: { toString: () => string };
    currency: string;
    billingPeriod: string;
    trialDays: number | null;
    isActive: boolean;
    features: Array<{
      featureId: string;
      value: string | null;
      feature: {
        id: string;
        name: string;
        slug: string;
      };
    }>;
  };
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState(plan?.name ?? "");
  const [slug, setSlug] = useState(plan?.slug ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [price, setPrice] = useState(plan?.price.toString() ?? "0");
  const [currency, setCurrency] = useState(plan?.currency ?? "USD");
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year" | "lifetime">(
    (plan?.billingPeriod as "month" | "year" | "lifetime") ?? "month"
  );
  const [trialDays, setTrialDays] = useState(plan?.trialDays?.toString() ?? "0");
  const [isActive, setIsActive] = useState(plan?.isActive ?? true);
  const [selectedFeatures, setSelectedFeatures] = useState<
    Array<{ featureId: string; value?: string }>
  >(
    plan?.features.map((f) => ({
      featureId: f.featureId,
      value: f.value ?? undefined,
    })) ?? []
  );

  // Fetch available features
  const { data: features } = api.subscriptions.features.list.useQuery();

  const createPlan = api.subscriptions.plans.create.useMutation({
    onSuccess: () => {
      router.push("/admin/plans");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updatePlan = api.subscriptions.plans.update.useMutation({
    onSuccess: () => {
      router.push("/admin/plans");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = {
      name,
      slug,
      description: description || undefined,
      price: parseFloat(price),
      currency,
      billingInterval: billingPeriod,
      trialDays: parseInt(trialDays) || 0,
      isActive,
      featureIds: selectedFeatures.map((f) => ({
        featureId: f.featureId,
        value: f.value,
      })),
    };

    if (plan) {
      updatePlan.mutate({ id: plan.id, ...data });
    } else {
      createPlan.mutate(data);
    }
  };

  const toggleFeature = (featureId: string) => {
    const exists = selectedFeatures.find((f) => f.featureId === featureId);
    if (exists) {
      setSelectedFeatures(selectedFeatures.filter((f) => f.featureId !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, { featureId }]);
    }
  };

  const updateFeatureValue = (featureId: string, value: string) => {
    setSelectedFeatures(
      selectedFeatures.map((f) =>
        f.featureId === featureId ? { ...f, value } : f
      )
    );
  };

  const isLoading = createPlan.isPending || updatePlan.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pro Plan"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="pro"
                required
                disabled={isLoading || !!plan}
              />
              {plan && (
                <p className="text-xs text-muted-foreground">
                  Slug cannot be changed
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Perfect for growing teams..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isLoading}
            />
            <Label htmlFor="isActive">Plan is active</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingPeriod">Billing Period *</Label>
              <select
                id="billingPeriod"
                value={billingPeriod}
                onChange={(e) =>
                  setBillingPeriod(e.target.value as "month" | "year" | "lifetime")
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trialDays">Trial Days</Label>
            <Input
              id="trialDays"
              type="number"
              min="0"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Set to 0 for no trial period
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          {features && features.length > 0 ? (
            <div className="space-y-3">
              {features.map((feature) => {
                const isSelected = selectedFeatures.find(
                  (f) => f.featureId === feature.id
                );
                return (
                  <div
                    key={feature.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <Switch
                        checked={!!isSelected}
                        onCheckedChange={() => toggleFeature(feature.id)}
                        disabled={isLoading}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">{feature.name}</Label>
                          <Badge variant="outline">{feature.featureType}</Badge>
                        </div>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        )}
                        {isSelected && feature.featureType === "numeric" && (
                          <Input
                            type="number"
                            placeholder="Value"
                            value={isSelected.value ?? ""}
                            onChange={(e) =>
                              updateFeatureValue(feature.id, e.target.value)
                            }
                            className="mt-2 max-w-xs"
                            disabled={isLoading}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No features available. Create features first.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {plan ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}

