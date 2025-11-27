import { Suspense } from "react";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";
import { Footer } from "~/components/footer";
import { FooterSkeleton } from "~/components/footer-skeleton";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex-1">{children}</div>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </>
  );
}

