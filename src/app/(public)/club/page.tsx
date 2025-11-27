import { HydrateClient } from "~/trpc/server";

export default async function ClubPage() {
  return (
    <HydrateClient>
      <main className="min-h-(--content-height)" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              КЛУБ
            </h1>
            <p className="text-xl font-bold text-primary">
              Присоединяйтесь к сообществу JEMSO
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-12">
            <section>
              <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
                JEMSO DRIVE CLUB
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                Автомобильное сообщество для всех желающих доступное по
                подписке, а также{" "}
                <span className="font-bold text-foreground">
                  Закрытый Автомобильный Клуб
                </span>{" "}
                с собственной структурой - стать участником которого можно
                только путем личного одобрения основателя клуба.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Представительства клуба сейчас действуют в 3 городах на
                постоянной основе:{" "}
                <span className="font-semibold">Махачкала</span>,{" "}
                <span className="font-semibold">Дербент</span>,{" "}
                <span className="font-semibold">Хасавюрт</span>.
              </p>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
                Регистрация на мероприятия
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Для участия в наших предстоящих мероприятиях, пожалуйста,
                свяжитесь с нами через социальные сети или электронную почту.
                Детали регистрации и требования будут предоставлены для каждого
                конкретного мероприятия.
              </p>
              <div className="rounded-lg border border-border/40 bg-card p-8">
                <h3 className="mb-4 text-xl font-bold text-foreground">
                  Контактная информация
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    Jemsodrive@gmail.com
                  </p>
                  <p>
                    <span className="font-semibold">Телефон:</span> +7 988
                    772-57-57
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
                Преимущества членства
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-card p-6">
                  <h3 className="mb-2 font-bold text-primary">
                    Эксклюзивные мероприятия
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Доступ к закрытым встречам и соревнованиям только для
                    участников
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-6">
                  <h3 className="mb-2 font-bold text-primary">Нетворкинг</h3>
                  <p className="text-sm text-muted-foreground">
                    Общение с единомышленниками-автолюбителями
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-6">
                  <h3 className="mb-2 font-bold text-primary">
                    Ранняя регистрация
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Приоритетный доступ к регистрации на мероприятия
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-6">
                  <h3 className="mb-2 font-bold text-primary">Скидки</h3>
                  <p className="text-sm text-muted-foreground">
                    Специальные цены на товары и взносы за мероприятия
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

