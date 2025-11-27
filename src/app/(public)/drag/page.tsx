import { HydrateClient } from "~/trpc/server";

export default async function DragPage() {
  return (
    <HydrateClient>
      <main className="min-h-[var(--content-height)]" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 bg-linear-to-b from-background to-background/95">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              ДРЭГ РЕЙСИНГ
            </h1>
            <p className="text-xl font-bold text-primary">
              Чистая скорость, чистый адреналин
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Чемпионат 2024
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                В сезоне 2024 года мы провели первый в истории открытый
                чемпионат Дагестана по дрэг рейсингу. Чемпионат прошел в три
                этапа. В нашем чемпионате приняли участие более 100 гонщиков в
                различных классах автомобилей.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Классы автомобилей
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <h3 className="mb-2 font-bold text-primary">STREET</h3>
                  <p className="text-sm text-muted-foreground">
                    Уличные автомобили с базовыми доработками
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <h3 className="mb-2 font-bold text-primary">PRO</h3>
                  <p className="text-sm text-muted-foreground">
                    Сильно модифицированные автомобили с турбо
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <h3 className="mb-2 font-bold text-primary">SUV</h3>
                  <p className="text-sm text-muted-foreground">
                    Кроссоверы и внедорожники в своей категории
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <h3 className="mb-2 font-bold text-primary">UNLIMITED</h3>
                  <p className="text-sm text-muted-foreground">
                    Без ограничений - чистая производительность
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Историческое достижение
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Наши соревнования по дрэг рейсингу ознаменовали возвращение
                официальных гонок в Дагестан после 12 лет. Мы гордимся тем, что
                продолжаем эту традицию и предоставляем безопасную, легальную
                платформу для любителей скорости.
              </p>
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
