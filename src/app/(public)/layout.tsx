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
      {/* Fixed Background Image Layer - Non-scrolling glowing effect */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2940&auto=format&fit=crop')",
            backgroundAttachment: "fixed",
            filter: "blur(1px)",
          }}
        />
        {/* Radial glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(220,38,38,0.05)_50%,transparent_100%)]" />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex-1 relative z-10">{children}</div>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </>
  );
}

