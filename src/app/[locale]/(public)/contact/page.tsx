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
  const t = await getTranslations({ locale, namespace: "Contact" });

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

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const tFooter = await getTranslations("Footer");

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("contactInfoTitle")}
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
                  <span className="font-semibold text-primary">{t("phone")}:</span>
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
              {t("legalDetailsTitle")}
            </h2>
            <div className="rounded-lg border border-border/40 bg-card p-8">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-foreground">
                    {t("entityName")}:
                  </span>
                  <p className="text-muted-foreground">
                    {t("entityFullName")}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{tFooter("legal.inn")}:</span>
                  <p className="text-muted-foreground">056203350846</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{tFooter("legal.ogrn")}:</span>
                  <p className="text-muted-foreground">319057100022896</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {t("bankAccount")}:
                  </span>
                  <p className="text-muted-foreground">40802810302500075213</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {t("bankName")}:
                  </span>
                  <p className="text-muted-foreground">{t("bankNameValue")}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{t("bankBic")}:</span>
                  <p className="text-muted-foreground">044525104</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">{t("bankInn")}:</span>
                  <p className="text-muted-foreground">9721194461</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {t("correspondentAccount")}:
                  </span>
                  <p className="text-muted-foreground">30101810745374525104</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {t("bankLegalAddress")}:
                  </span>
                  <p className="text-muted-foreground">
                    {t("bankLegalAddressValue")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight text-foreground">
              {t("socialMediaTitle")}
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
    </PageWrapper>
  );
}
