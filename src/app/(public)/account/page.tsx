import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AccountTabs } from "./_components/account-tabs";
import { PageWrapper } from "~/components/page-wrapper";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Настройки аккаунта</h1>
          <p className="mt-2 text-muted-foreground">
            Управление настройками и параметрами вашего аккаунта
          </p>
        </div>

        <AccountTabs />
      </div>
    </PageWrapper>
  );
}

