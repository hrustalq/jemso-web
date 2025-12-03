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
  const t = await getTranslations({ locale, namespace: "Drift" });

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

export default async function DriftPage() {
  const t = await getTranslations("Drift");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("aboutTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("aboutText")}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("october2024Title")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("october2024Text")}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("joinTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("joinText")}
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
