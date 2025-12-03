import { type Metadata, type Viewport } from "next";
import { Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing, type Locale } from "~/i18n/routing";

import "~/styles/globals.css";

import { AnimatedMeshBackground } from "~/components/animated-mesh-background";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRussian = locale === "ru";

  return {
    title: {
      template: "%s | JEMSO",
      default: isRussian
        ? "JEMSO - Радость в движении!"
        : "JEMSO - Joy in Motion!",
    },
    description: isRussian
      ? "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу. JEMSO EVENTS, JEMSO MOTORSPORT, JEMSO DRIVE CLUB, JEMSO MEDIA. Автомобильные выставки, автопробеги, тюнинг и обслуживание автомобилей."
      : "JEMSO DRIVE - automotive community, organizing festivals, races, drift and drag racing championships. JEMSO EVENTS, JEMSO MOTORSPORT, JEMSO DRIVE CLUB, JEMSO MEDIA. Car exhibitions, road trips, car tuning and maintenance.",
    keywords: isRussian
      ? [
          "JEMSO",
          "JEMSO DRIVE",
          "автомобильное сообщество",
          "автомобильные фестивали",
          "дрифт",
          "дрэг-рейсинг",
          "автомобильные выставки",
          "автопробеги",
          "мотоспорт",
          "тюнинг автомобилей",
          "автомобильный клуб",
          "JEMSO EVENTS",
          "JEMSO MOTORSPORT",
          "JEMSO DRIVE CLUB",
          "JEMSO MEDIA",
          "автомобильная культура",
          "гонки",
          "автомобильные шоу",
          "Дагестан",
          "Махачкала",
        ]
      : [
          "JEMSO",
          "JEMSO DRIVE",
          "automotive community",
          "car festivals",
          "drift",
          "drag racing",
          "car exhibitions",
          "road trips",
          "motorsport",
          "car tuning",
          "car club",
          "JEMSO EVENTS",
          "JEMSO MOTORSPORT",
          "JEMSO DRIVE CLUB",
          "JEMSO MEDIA",
          "car culture",
          "racing",
          "car shows",
        ],
    authors: [{ name: "JEMSO" }],
    creator: "JEMSO",
    publisher: "JEMSO",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: isRussian ? "ru_RU" : "en_US",
      url: "/",
      siteName: "JEMSO",
      title: isRussian
        ? "JEMSO - Радость в движении!"
        : "JEMSO - Joy in Motion!",
      description: isRussian
        ? "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу."
        : "JEMSO DRIVE - automotive community, organizing festivals, races, drift and drag racing championships.",
    },
    twitter: {
      card: "summary_large_image",
      title: isRussian
        ? "JEMSO - Радость в движении!"
        : "JEMSO - Joy in Motion!",
      description: isRussian
        ? "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу."
        : "JEMSO DRIVE - automotive community, organizing festivals, races, drift and drag racing championships.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${roboto.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <Providers>
            <AnimatedMeshBackground />
            {children}
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

