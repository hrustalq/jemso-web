import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AppProviders } from "~/components/app-providers";
import { UserSidebar } from "./_components/user-sidebar";
import { UserMobileNav } from "./_components/user-mobile-nav";
import { UserHeader } from "./_components/user-header";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/dashboard");
  }

  return (
    <AppProviders>
      <div className="flex min-h-screen">
        {/* Header - fixed at top */}
        <UserHeader user={session.user} />

        {/* Sidebar - hidden on mobile, visible on desktop */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card/50 backdrop-blur-sm pt-16">
          <UserSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 lg:pl-64 min-h-screen pb-20 lg:pb-0 pt-16">
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <UserMobileNav />
      </div>
    </AppProviders>
  );
}

