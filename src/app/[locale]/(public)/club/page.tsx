import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageWrapper } from "~/components/page-wrapper";

// Force static rendering for this page
export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Club" });

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

export default async function ClubPage() {
  const t = await getTranslations("Club");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <section>
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
              JEMSO DRIVE CLUB
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              {t("clubDescription")}{" "}
              <span className="font-bold text-foreground">
                {t("closedClub")}
              </span>{" "}
              {t("clubDescriptionEnd")}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("chaptersIntro")}{" "}
              <span className="font-semibold">{t("makhachkala")}</span>,{" "}
              <span className="font-semibold">{t("derbent")}</span>,{" "}
              <span className="font-semibold">{t("khasavyurt")}</span>.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
              {t("eventRegistrationTitle")}
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              {t("eventRegistrationText")}
            </p>
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <h3 className="mb-4 text-xl font-bold text-foreground">
                {t("contactInfo")}
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  Jemsodrive@gmail.com
                </p>
                <p>
                  <span className="font-semibold">{t("phone")}:</span> +7 988
                  772-57-57
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-tight text-foreground">
              {t("membershipTitle")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <h3 className="mb-2 font-bold text-primary">
                  {t("exclusiveEventsTitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("exclusiveEventsDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <h3 className="mb-2 font-bold text-primary">
                  {t("networkingTitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("networkingDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <h3 className="mb-2 font-bold text-primary">
                  {t("earlyRegistrationTitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("earlyRegistrationDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-6">
                <h3 className="mb-2 font-bold text-primary">
                  {t("discountsTitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("discountsDesc")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
