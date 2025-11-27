import Link from "next/link";
import { HydrateClient } from "~/trpc/server";

export default async function AboutPage() {
  return (
    <HydrateClient>
      <main className="min-h-[var(--content-height)]" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 bg-linear-to-b from-background to-background/95">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              О нас
            </h1>
            <p className="text-xl font-bold text-primary">
              JEMSO DRIVE - JOY IN MOTION!
            </p>
            <p className="mt-2 text-lg text-muted-foreground">
              ДЖЕМСО - Радость в движении!
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-12">
            <section>
              <p className="mb-8 text-lg leading-relaxed text-foreground/90">
                <span className="font-bold text-foreground">JEMSO</span> - это движение с несколькими направлениями и все они связаны с автомобилями. На сегодняшний день бренд включает в себя:
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                  <h3 className="mb-3 text-xl font-bold text-primary">
                    JEMSO EVENTS
                  </h3>
                  <p className="leading-relaxed text-foreground/80">
                    Компания по организации автомобильных фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу, автомобильных шоу, автопробегов.
                  </p>
                </div>

                <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                  <h3 className="mb-3 text-xl font-bold text-primary">
                    JEMSO MOTORSPORT
                  </h3>
                  <p className="leading-relaxed text-foreground/80">
                    Сервис по доработке и обслуживанию автомобилей, в том числе гоночных.
                  </p>
                </div>

                <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                  <h3 className="mb-3 text-xl font-bold text-primary">
                    JEMSO DRIVE CLUB
                  </h3>
                  <p className="leading-relaxed text-foreground/80">
                    Автомобильное сообщество для всех желающих доступное по подписке, так же – <span className="font-semibold text-foreground">Закрытый Автомобильный Клуб</span> с собственной структурой - стать участником которого можно только путем личного одобрения основателя клуба.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                    Представительства клуба сейчас действуют в 3 городах на постоянной основе: Махачкала, Дербент, Хасавюрт.
                  </p>
                </div>

                <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                  <h3 className="mb-3 text-xl font-bold text-primary">
                    JEMSO MEDIA
                  </h3>
                  <p className="leading-relaxed text-foreground/80">
                    YouTube канал и другие медийные площадки посвященные автомобильной тематике.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
              <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
                Историческая справка
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-foreground/90">
                <span className="font-bold text-foreground">JEMSO</span> - это аббревиатура которая расшифровывается как:
              </p>
              <ul className="space-y-3 text-base sm:text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary">J</span>
                  <span className="pt-1 text-foreground/80">JDM</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary">E</span>
                  <span className="pt-1 text-foreground/80">EURO, ELITE</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary">M</span>
                  <span className="pt-1 text-foreground/80">MUSCLE CAR, MOTORCYCLE</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary">S</span>
                  <span className="pt-1 text-foreground/80">STANCE, SPORT</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary">O</span>
                  <span className="pt-1 text-foreground/80">OFF ROAD, OLD SCHOOL</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-8 text-3xl font-bold uppercase tracking-tight text-foreground">
                Наша история
              </h2>
              <div className="space-y-8">
                <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2020</span>
                    Начало
                  </h3>
                  <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                    <p>
                      Мы начали свою деятельность как клуб собираясь по указанным выше направлениям на улицах Махачкалы. Наши подпольные встречи стали быстро набирать популярность из-за уютной атмосферы и взаимного уважения.
                    </p>
                    <p>
                      Нам с первых встреч удалось создать обстановку для продуктивного общения, так уже на втором мероприятии случилась первая сделка по обмену автомобилей между участниками. Нам просто в кайф тусоваться рядом со своими железными конями и мы не против взаимовыгодных предложений.
                    </p>
                    <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-3 italic">
                      <p className="text-foreground">
                        Как говорит основатель JEMSO Шамиль МС Хайбулаев: &quot;JEMSO - это эмоция которую ты испытываешь находясь в центре автомобильной тусовки&quot;
                      </p>
                    </blockquote>
                    <p>
                      В этом же году из-за слишком большого количества желающих участвовать мы вышли из тени и стали проводить официальные мероприятия и делать первые коллаборации.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2021</span>
                    АвтоГодекан
                  </h3>
                  <div className="space-y-3 text-base leading-relaxed text-foreground/85">
                    <p>
                      Мы провели АвтоГодекан. Самый крупный из наших фестивалей который мы проводим 1 раз в 4 года. В котором мы отметили призами и подарками лучших по мнению жюри представителей каждого направления, а после состоялось показательное выступление Дагестанских дрифтеров.
                    </p>
                    <p className="rounded-md bg-muted/50 p-3 text-sm italic text-foreground/70">
                      Первый автогодекан был проведен нашим основателем совместно с Mansory Club аж в 2017 году, тогда еще не было JEMSO.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2022</span>
                    Легализация
                  </h3>
                  <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                    <p>
                      Мы провели первую большую легальную тусовку в центре города. Это было открытие сезона и его мы посвятили в память Заура Ибрагимова и Саида Губденского.
                    </p>
                    <p>
                      Далее мы сделали еще одно мероприятие совместная сходка Mercedes Club W124 и BMW E34, кстати на этом мероприятии мы впервые провели гонки в стиле Gymkhana.
                    </p>
                    <p>
                      А потом Шамиль поехал по России помогая в организации многочисленных автомобильных мероприятий по всей России как выставочных так и спортивных, чтобы набраться опыта у лучших.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2023</span>
                    Расширение
                  </h3>
                  <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                    <p>
                      2023 год стал самым плодотворным по количеству выставок. Мы провели аж 5 выставок за год:
                    </p>
                    <ul className="ml-6 space-y-2 list-disc">
                      <li>2 выставки прошли зимой в ангаре в Токийском стиле</li>
                      <li>Еще 2 мы приурочили к выходу 10 части всеми любимого форсажа</li>
                      <li>Выставка ретро-автомобилей в Дербенте - впервые за пределами Махачкалы</li>
                    </ul>
                    <p>
                      И наконец в октябре этого же года мы проводим первые за 12 лет официальные гонки в Дагестане.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/40 bg-linear-to-br from-card to-primary/5 p-6 sm:p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">2024</span>
                    Прорыв
                  </h3>
                  <div className="space-y-4 text-base leading-relaxed">
                    <div>
                      <p className="font-semibold text-foreground">Апрель - Сентябрь</p>
                      <p className="mt-1 text-foreground/80">
                        Первый в истории{" "}
                        <Link href="/drag" className="font-semibold text-primary underline-offset-4 hover:underline">
                          чемпионат Дагестана по Дрэг Рейсингу
                        </Link>
                        !
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Сентябрь</p>
                      <p className="mt-1 text-foreground/80">
                        За неделю до финального этапа гонок - мы бьем собственный (а значит и региональный) рекорд по масштабу выставки в центре города.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Октябрь</p>
                      <p className="mt-1 text-foreground/80">
                        Мы возвращаем{" "}
                        <Link href="/drift" className="font-semibold text-primary underline-offset-4 hover:underline">
                          официальный дрифт
                        </Link>{" "}
                        в Дагестан.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

