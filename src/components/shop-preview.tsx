import Link from "next/link";
import { ShoppingBag, Package, Truck, Shield } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

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

export function ShopPreview() {
  return (
    <div className="space-y-8">
      {/* Shop Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`animate animate-fadeInUp stagger-${index + 1} group border-border/40 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50`}
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
      <Card className="animate animate-scaleIn delay-300 border-border/40 bg-linear-to-br from-primary/10 to-primary/5 p-12 text-center backdrop-blur">
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

