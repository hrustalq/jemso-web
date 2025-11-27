import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AccountTabs } from "./_components/account-tabs";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <AccountTabs />
      </div>
    </div>
  );
}

