import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/page-wrapper";
import { Link } from "~/i18n/navigation";

// Force static rendering for this page
export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <section>
            <p className="mb-8 text-lg leading-relaxed text-foreground/90">
              <span className="font-bold text-foreground">JEMSO</span> - {t("intro")}
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                <h3 className="mb-3 text-xl font-bold text-primary">
                  {t("events.title")}
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  {t("events.description")}
                </p>
              </div>

              <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                <h3 className="mb-3 text-xl font-bold text-primary">
                  {t("motorsport.title")}
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  {t("motorsport.description")}
                </p>
              </div>

              <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                <h3 className="mb-3 text-xl font-bold text-primary">
                  {t("club.title")}
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  {t("club.description")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                  {t("club.cities")}
                </p>
              </div>

              <div className="rounded-lg border border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                <h3 className="mb-3 text-xl font-bold text-primary">
                  {t("media.title")}
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  {t("media.description")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
              {t("history.title")}
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-foreground/90">
              <span className="font-bold text-foreground">JEMSO</span> - {t("history.intro")}
            </p>
            <ul className="space-y-3 text-base sm:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">J</span>
                <span className="pt-1 text-foreground/80">{t("history.letters.j")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">E</span>
                <span className="pt-1 text-foreground/80">{t("history.letters.e")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">M</span>
                <span className="pt-1 text-foreground/80">{t("history.letters.m")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">S</span>
                <span className="pt-1 text-foreground/80">{t("history.letters.s")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">O</span>
                <span className="pt-1 text-foreground/80">{t("history.letters.o")}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold uppercase tracking-tight text-foreground">
              {t("timeline.title")}
            </h2>
            <div className="space-y-8">
              <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2020</span>
                  {t("timeline.2020.title")}
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                  <p>{t("timeline.2020.p1")}</p>
                  <p>{t("timeline.2020.p2")}</p>
                  <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-3 italic">
                    <p className="text-foreground">{t("timeline.2020.quote")}</p>
                  </blockquote>
                  <p>{t("timeline.2020.p3")}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2021</span>
                  {t("timeline.2021.title")}
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-foreground/85">
                  <p>{t("timeline.2021.p1")}</p>
                  <p className="rounded-md bg-muted/50 p-3 text-sm italic text-foreground/70">
                    {t("timeline.2021.note")}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2022</span>
                  {t("timeline.2022.title")}
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                  <p>{t("timeline.2022.p1")}</p>
                  <p>{t("timeline.2022.p2")}</p>
                  <p>{t("timeline.2022.p3")}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-card/50 p-6 sm:p-8">
                <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">2023</span>
                  {t("timeline.2023.title")}
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                  <p>{t("timeline.2023.p1")}</p>
                  <ul className="ml-6 space-y-2 list-disc">
                    <li>{t("timeline.2023.list1")}</li>
                    <li>{t("timeline.2023.list2")}</li>
                    <li>{t("timeline.2023.list3")}</li>
                  </ul>
                  <p>{t("timeline.2023.p2")}</p>
                </div>
              </div>

              <div className="rounded-lg border border-primary/40 bg-linear-to-br from-card to-primary/5 p-6 sm:p-8">
                <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">2024</span>
                  {t("timeline.2024.title")}
                </h3>
                <div className="space-y-4 text-base leading-relaxed">
                  <div>
                    <p className="font-semibold text-foreground">{t("timeline.2024.apr_sep")}</p>
                    <p className="mt-1 text-foreground/80">
                      {t("timeline.2024.apr_sep_text").split("чемпионат Дагестана по Дрэг Рейсингу")[0]}
                      <Link href="/drag" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("timeline.2024.apr_sep_text").includes("чемпионат") ? "чемпионат Дагестана по Дрэг Рейсингу" : "Dagestan Drag Racing Championship"}
                      </Link>
                      !
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("timeline.2024.sep")}</p>
                    <p className="mt-1 text-foreground/80">{t("timeline.2024.sep_text")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("timeline.2024.oct")}</p>
                    <p className="mt-1 text-foreground/80">
                      {t("timeline.2024.oct_text").split("официальный дрифт")[0]}
                      <Link href="/drift" className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("timeline.2024.oct_text").includes("официальный") ? "официальный дрифт" : "official drift"}
                      </Link>
                      {t("timeline.2024.oct_text").split("официальный дрифт")[1] ?? t("timeline.2024.oct_text").split("official drift")[1]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
