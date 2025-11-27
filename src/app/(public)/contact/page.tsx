import { HydrateClient } from "~/trpc/server";

export default async function ContactPage() {
  return (
    <HydrateClient>
      <main className="min-h-(--content-height)" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 bg-linear-to-b from-background to-background/95">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight text-foreground sm:text-6xl">
              Контакты и Реквизиты
            </h1>
            <p className="text-xl font-bold text-primary">Свяжитесь с нами</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight text-foreground">
                Контактная информация
              </h2>
              <div className="rounded-lg border border-border/40 bg-card p-8">
                <div className="space-y-4 text-lg">
                  <div>
                    <span className="font-semibold text-primary">Email:</span>
                    <p className="text-muted-foreground">
                      <a 
                        href="mailto:Jemsodrive@gmail.com"
                        className="transition-colors hover:text-primary"
                      >
                        Jemsodrive@gmail.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Телефон:</span>
                    <p className="text-muted-foreground">
                      <a 
                        href="tel:+79887725757"
                        className="transition-colors hover:text-primary"
                      >
                        +7 988 772-57-57
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight text-foreground">
                Реквизиты
              </h2>
              <div className="rounded-lg border border-border/40 bg-card p-8">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-foreground">
                      Наименование:
                    </span>
                    <p className="text-muted-foreground">
                      Индивидуальный предприниматель Хайбулаев Шамиль Магомедрашидович
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">ИНН:</span>
                    <p className="text-muted-foreground">056203350846</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">ОГРНИП:</span>
                    <p className="text-muted-foreground">319057100022896</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Расчётный счёт:
                    </span>
                    <p className="text-muted-foreground">40802810302500075213</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Наименование банка:
                    </span>
                    <p className="text-muted-foreground">ООО &quot;Банк Точка&quot;</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">БИК банка:</span>
                    <p className="text-muted-foreground">044525104</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">ИНН банка:</span>
                    <p className="text-muted-foreground">9721194461</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Корреспондентский счёт:
                    </span>
                    <p className="text-muted-foreground">30101810745374525104</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Юридический адрес банка:
                    </span>
                    <p className="text-muted-foreground">
                      109044, Российская Федерация, г. Москва, вн.тер.г. муниципальный округ Южнопортовый, пер. 3-й Крутицкий, д.11, помещ. 7Н
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight text-foreground">
                Социальные сети
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="https://www.instagram.com/jemso_drive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary"
                >
                  <h3 className="mb-2 font-bold text-primary">Instagram</h3>
                  <p className="text-sm text-muted-foreground">
                    @jemso_drive
                  </p>
                </a>
                <a
                  href="https://www.youtube.com/@jemsodrive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary"
                >
                  <h3 className="mb-2 font-bold text-primary">YouTube</h3>
                  <p className="text-sm text-muted-foreground">@jemsodrive</p>
                </a>
                <a
                  href="https://t.me/jemsodrive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary"
                >
                  <h3 className="mb-2 font-bold text-primary">Telegram</h3>
                  <p className="text-sm text-muted-foreground">@jemsodrive</p>
                </a>
                <a
                  href="https://vk.com/jemso_drive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary"
                >
                  <h3 className="mb-2 font-bold text-primary">VK</h3>
                  <p className="text-sm text-muted-foreground">jemso_drive</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

