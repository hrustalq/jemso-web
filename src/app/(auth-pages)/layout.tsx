import { Suspense } from "react";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex-1">{children}</div>
    </>
  );
}

