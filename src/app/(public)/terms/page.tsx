import type { Metadata } from "next";
import { PageWrapper } from "~/components/page-wrapper";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Условия использования платформы JEMSO. Ознакомьтесь с правилами предоставления услуг, использования контента и участия в мероприятиях.",
  keywords: [
    "условия использования",
    "правила",
    "JEMSO",
    "пользовательское соглашение",
    "условия предоставления услуг",
  ],
  openGraph: {
    title: "Условия использования | JEMSO",
    description: "Условия использования платформы JEMSO. Ознакомьтесь с правилами предоставления услуг.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Условия использования | JEMSO",
    description: "Условия использования платформы JEMSO.",
  },
};

// Force static rendering for this page
export const dynamic = 'force-static';

export default function TermsPage() {
  return (
    <PageWrapper>
        <div className="border-b border-border/40 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-6xl">
              Условия использования
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Ознакомьтесь с нашими условиями предоставления услуг.
            </p>
          </div>
        </div>
      </PageWrapper>
  );
}

