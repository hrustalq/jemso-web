import { HydrateClient } from "~/trpc/server";
import { PageWrapper } from "~/components/page-wrapper";

export default async function ShopPage() {
  return (
    <HydrateClient>
      <PageWrapper>
        <div className="border-b border-border/40 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
              МАГАЗИН
            </h1>
            <p className="text-lg font-bold text-primary sm:text-xl">
              Официальный мерч и аксессуары
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-8 text-lg text-muted-foreground">
              Наш интернет-магазин скоро откроется! Следите за эксклюзивным
              мерчем JEMSO DRIVE, одеждой и автомобильными аксессуарами.
            </p>
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Скоро открытие
              </h2>
              <p className="text-muted-foreground">
                Подписывайтесь на наши социальные сети, чтобы первыми узнать о
                запуске магазина.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}

