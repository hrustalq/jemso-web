"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

interface AnimatedPlanCardProps {
  plans: Plan[];
}

export function AnimatedPlanCard({ plans }: AnimatedPlanCardProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".plan-card");
    if (cards.length === 0) return;

    // Set initial state
    cards.forEach((card) => {
      gsap.set(card, { 
        opacity: 0, 
        y: 40,
        willChange: "transform, opacity"
      });
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top bottom-=50",
        once: true, // Only animate once
      },
    });

    // Animate each card
    cards.forEach((card, index) => {
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(card, { willChange: "auto" });
        }
      }, index * 0.1);
    });

    // Hover animations with proper cleanup
    const hoverHandlers = new Map<HTMLElement, {
      enter: () => void;
      leave: () => void;
      tween: gsap.core.Tween | null;
    }>();

    cards.forEach((card) => {
      const element = card as HTMLElement;
      let hoverTween: gsap.core.Tween | null = null;

      const handleMouseEnter = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(element, {
          y: -8,
          boxShadow: "0 20px 60px -10px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(element, {
          y: 0,
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      hoverHandlers.set(element, {
        enter: handleMouseEnter,
        leave: handleMouseLeave,
        tween: hoverTween,
      });
    });

    return () => {
      tl.kill();
      
      // Remove all event listeners and kill their tweens
      hoverHandlers.forEach((handlers, element) => {
        element.removeEventListener("mouseenter", handlers.enter);
        element.removeEventListener("mouseleave", handlers.leave);
        if (handlers.tween) {
          handlers.tween.kill();
        }
        gsap.killTweensOf(element);
      });
      hoverHandlers.clear();
    };
  }, [plans]);

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
    <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`plan-card relative flex h-full flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur ${
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
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
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
              <Button
                className="w-full"
                variant="default"
                size="lg"
              >
                Выбрать план
              </Button>
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

