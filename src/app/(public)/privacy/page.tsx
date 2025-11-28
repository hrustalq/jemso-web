import type { Metadata } from "next";
import { PageWrapper } from "~/components/page-wrapper";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности JEMSO. Узнайте, как мы собираем, используем и защищаем ваши персональные данные в соответствии с законодательством РФ.",
  keywords: [
    "политика конфиденциальности",
    "защита данных",
    "персональные данные",
    "JEMSO",
    "конфиденциальность",
    "GDPR",
  ],
  openGraph: {
    title: "Политика конфиденциальности | JEMSO",
    description: "Политика конфиденциальности JEMSO. Узнайте, как мы собираем, используем и защищаем ваши данные.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Политика конфиденциальности | JEMSO",
    description: "Политика конфиденциальности JEMSO. Узнайте, как мы защищаем ваши данные.",
  },
};

// Force static rendering for this page
export const dynamic = 'force-static';

export default async function PrivacyPage() {
  return (
    <PageWrapper>
      <div className="border-b border-border/40 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-6xl">
            Политика конфиденциальности
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Узнайте, как мы собираем, используем и защищаем ваши данные.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

