import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";
import { AuthProviders } from "~/components/auth-providers";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Авторизация",
  description: "Войдите в свой аккаунт JEMSO или создайте новый для доступа ко всем возможностям платформы",
};

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const categories = await api.blog.categories.navigation({ locale });

  return (
    <AuthProviders>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header categories={categories} />
      </Suspense>
      <div className="flex-1">{children}</div>
    </AuthProviders>
  );
}
