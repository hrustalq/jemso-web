import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Roboto } from "next/font/google";

import { AnimatedMeshBackground } from "~/components/animated-mesh-background";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | JEMSO",
    default: "JEMSO - Радость в движении!",
  },
  description: "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу. JEMSO EVENTS, JEMSO MOTORSPORT, JEMSO DRIVE CLUB, JEMSO MEDIA. Автомобильные выставки, автопробеги, тюнинг и обслуживание автомобилей.",
  keywords: [
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
    locale: "ru_RU",
    url: "/",
    siteName: "JEMSO",
    title: "JEMSO - Радость в движении!",
    description: "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу. Автомобильные выставки, автопробеги, тюнинг и обслуживание автомобилей.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JEMSO - Радость в движении!",
    description: "JEMSO DRIVE - автомобильное сообщество, организация фестивалей, гонок, чемпионатов по дрифту и дрэг-рейсингу.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // Essential for safe area insets on iOS
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`dark ${roboto.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <AnimatedMeshBackground />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
