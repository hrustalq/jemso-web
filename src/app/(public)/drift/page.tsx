import { HydrateClient } from "~/trpc/server";
import { PageWrapper } from "~/components/page-wrapper";

export default async function DriftPage() {
  return (
    <HydrateClient>
      <PageWrapper>
        <div className="border-b border-border/40 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
              ДРИФТ
            </h1>
            <p className="text-lg font-bold text-primary sm:text-xl">
              Мы любим давать боком!
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                О дрифт мероприятиях
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                JEMSO DRIVE организует профессиональные соревнования по дрифту и
                шоу по всему Дагестану. Мы объединяем лучших водителей и
                предоставляем платформу как для опытных дрифтеров, так и для
                новичков, чтобы продемонстрировать свои навыки.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Октябрь 2024
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Мы вернули официальный дрифт в Дагестан после многолетнего
                отсутствия. Наш чемпионат привлек водителей со всего региона и
                установил новый стандарт для автоспортивных мероприятий в этом
                районе.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
                Присоединяйтесь к нам
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Независимо от того, являетесь ли вы опытным профессионалом или
                только начинаете, JEMSO DRIVE приветствует все уровни навыков.
                Следите за разделом новостей для получения информации о
                предстоящих мероприятиях и регистрации.
              </p>
            </section>
          </div>
        </div>
      </PageWrapper>
    </HydrateClient>
  );
}
