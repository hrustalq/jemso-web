import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Roboto } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "~/components/providers";
import { AnimatedMeshBackground } from "~/components/animated-mesh-background";

export const metadata: Metadata = {
  title: "Jemso",
  description: "Modern web application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // Essential for safe area insets on iOS
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${roboto.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <AnimatedMeshBackground />
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
