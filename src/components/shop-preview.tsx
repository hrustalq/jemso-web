"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingBag, Package, Truck, Shield, type LucideIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const featureIcons: Record<string, LucideIcon> = {
  original: Package,
  delivery: Truck,
  quality: Shield,
};

const featureKeys = ["original", "delivery", "quality"] as const;

export function ShopPreview() {
  const t = useTranslations("ShopPreview");

  return (
    <div className="space-y-8">
      {/* Shop Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureKeys.map((key, index) => {
          const Icon = featureIcons[key];
          return (
            <Card
              key={key}
              className={`animate animate-fadeInUp stagger-${index + 1} group border-border/40 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {t(`features.${key}.description`)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="animate animate-scaleIn delay-300 border-border/40 bg-linear-to-br from-primary/10 to-primary/5 p-12 text-center backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-6">
          <ShoppingBag className="mx-auto h-16 w-16 text-primary" />
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground">
              {t("cta.title")}
            </h3>
            <p className="text-lg text-foreground/80">
              {t("cta.description")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                {t("cta.shopButton")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop/collections">
                {t("cta.collectionsButton")}
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

