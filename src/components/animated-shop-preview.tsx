"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { ShoppingBag, Package, Truck, Shield } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export function AnimatedShopPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardsRef.current || !ctaRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".shop-card");

    // Animate cards on mount
    gsap.fromTo(cards, 
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      }
    );

    // Animate CTA card
    gsap.fromTo(ctaRef.current,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      }
    );
  }, { scope: sectionRef });

  const features = [
    {
      icon: Package,
      title: "Оригинальная продукция",
      description: "Официальные товары и мерч JEMSO",
    },
    {
      icon: Truck,
      title: "Быстрая доставка",
      description: "Доставка по всей России за 2-5 дней",
    },
    {
      icon: Shield,
      title: "Гарантия качества",
      description: "100% гарантия на всю продукцию",
    },
  ];

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Shop Features */}
      <div
        ref={cardsRef}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            className="shop-card group border-border/40 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-foreground/70">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card ref={ctaRef} className="border-border/40 bg-linear-to-br from-primary/10 to-primary/5 p-12 text-center backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-6">
          <ShoppingBag className="mx-auto h-16 w-16 text-primary" />
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-foreground">
              Магазин JEMSO
            </h3>
            <p className="text-lg text-foreground/80">
              Эксклюзивная одежда, аксессуары и снаряжение для автоспорта.
              Станьте частью команды JEMSO!
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                Перейти в магазин
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop/collections">
                Посмотреть коллекции
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

