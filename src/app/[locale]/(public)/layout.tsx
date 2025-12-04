import { Suspense } from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";
import { Footer } from "~/components/footer";
import { FooterSkeleton } from "~/components/footer-skeleton";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

// Fetch shared data once for Header and Footer
async function getLayoutData(locale: string) {
  const [session, categories] = await Promise.all([
    auth(),
    api.blog.categories.navigation({ locale }),
  ]);
  return { session, categories };
}

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const { session, categories } = await getLayoutData(locale);
  
  return (
    <>
      {/* Fixed Background Image Layer - Optimized with Next.js Image */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Use pre-blurred image from Unsplash (blur=50 in URL) for better performance */}
        <Image
          src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=60&w=1920&auto=format&fit=crop&blur=50"
          alt=""
          fill
          className="object-cover opacity-[0.06] dark:opacity-[0.10]"
          sizes="100vw"
          quality={75}
          loading="eager"
          priority={false}
          aria-hidden="true"
        />
        {/* Very subtle blue glow overlay matching logo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,75,135,0.015)_50%,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(100,150,200,0.02)_50%,transparent_100%)]" />
        {/* Light gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/30 to-background/60" />
      </div>

      <Suspense fallback={<HeaderSkeleton />}>
        <Header session={session} categories={categories} />
      </Suspense>
      <div className="flex-1 relative z-0 min-h-(--content-height)">{children}</div>
      <div className="relative z-0">
        <Suspense fallback={<FooterSkeleton />}>
          <Footer session={session} categories={categories} />
        </Suspense>
      </div>
    </>
  );
}

