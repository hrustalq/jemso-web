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
  const t = await getTranslations({ locale, namespace: "Drag" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title") + " | JEMSO",
      description: t("metadata.description"),
    },
  };
}

export default async function DragPage() {
  const t = await getTranslations("Drag");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("championship2024Title")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("championship2024Text")}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("carClassesTitle")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/40 bg-card p-4">
                <h3 className="mb-2 font-bold text-primary">STREET</h3>
                <p className="text-sm text-muted-foreground">
                  {t("streetDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-4">
                <h3 className="mb-2 font-bold text-primary">PRO</h3>
                <p className="text-sm text-muted-foreground">
                  {t("proDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-4">
                <h3 className="mb-2 font-bold text-primary">SUV</h3>
                <p className="text-sm text-muted-foreground">
                  {t("suvDesc")}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card p-4">
                <h3 className="mb-2 font-bold text-primary">UNLIMITED</h3>
                <p className="text-sm text-muted-foreground">
                  {t("unlimitedDesc")}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("historicTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("historicText")}
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
