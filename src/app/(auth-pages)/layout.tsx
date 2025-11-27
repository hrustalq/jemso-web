import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";

export const metadata: Metadata = {
  title: "Авторизация | JEMSO",
  description: "Войдите в свой аккаунт JEMSO или создайте новый для доступа ко всем возможностям платформы",
};

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

