import { HydrateClient } from "~/trpc/server";

export default async function ShopPage() {
  return (
    <HydrateClient>
      <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 pt-6 md:pt-[calc(var(--header-height)+var(--safe-top)+2rem)]">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              МАГАЗИН
            </h1>
            <p className="text-xl font-bold text-primary">
              Официальный мерч и аксессуары
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
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
      </main>
    </HydrateClient>
  );
}

