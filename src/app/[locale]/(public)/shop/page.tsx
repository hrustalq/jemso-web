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
  const t = await getTranslations({ locale, namespace: "Shop" });

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

export default async function ShopPage() {
  const t = await getTranslations("Shop");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-lg text-muted-foreground">
            {t("comingSoonIntro")}
          </p>
          <div className="rounded-lg border border-border/40 bg-card p-8">
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("comingSoonTitle")}
            </h2>
            <p className="text-muted-foreground">
              {t("comingSoonText")}
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
