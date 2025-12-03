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
      {/* Fixed Background Image Layer - Non-scrolling subtle effect */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] dark:opacity-[0.12]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2940&auto=format&fit=crop')",
            backgroundAttachment: "fixed",
            filter: "blur(1px)",
          }}
        />
        {/* Very subtle blue glow overlay matching logo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,75,135,0.015)_50%,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(100,150,200,0.02)_50%,transparent_100%)]" />
        {/* Light gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/30 to-background/60" />
      </div>

      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex-1 relative z-0 min-h-(--content-height)">{children}</div>
      <div className="relative z-0">
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}

