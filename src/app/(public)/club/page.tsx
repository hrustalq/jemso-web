import type { Metadata } from "next";
import { PageWrapper } from "~/components/page-wrapper";

export const metadata: Metadata = {
  title: "Клуб",
  description: "JEMSO DRIVE CLUB - автомобильное сообщество доступное по подписке и Закрытый Автомобильный Клуб. Представительства в Махачкале, Дербенте, Хасавюрте.",
  keywords: [
    "JEMSO DRIVE CLUB",
    "автомобильный клуб",
    "закрытый клуб",
    "JEMSO",
    "автомобильное сообщество",
    "подписка",
    "Махачкала",
    "Дербент",
    "Хасавюрт",
  ],
  openGraph: {
    title: "Клуб | JEMSO",
    description: "JEMSO DRIVE CLUB - автомобильное сообщество доступное по подписке и Закрытый Автомобильный Клуб.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Клуб | JEMSO",
    description: "JEMSO DRIVE CLUB - присоединяйтесь к автомобильному сообществу.",
  },
};

// Force static rendering for this page
export const dynamic = 'force-static';

export default async function ClubPage() {
  return (
    <PageWrapper>
      <div className="border-b border-border/40 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            КЛУБ
          </h1>
          <p className="text-lg font-bold text-primary sm:text-xl">
            Присоединяйтесь к сообществу JEMSO
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
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
    </PageWrapper>
  );
}

