import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { hasRole } from "~/server/api/rbac";
import { db } from "~/server/db";
import { Header } from "~/components/header";
import { HeaderSkeleton } from "~/components/header-skeleton";
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  CreditCard,
  Settings,
  Star,
  Calendar,
  Folder,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Blog Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    title: "Subscription Plans",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    title: "Features",
    href: "/admin/features",
    icon: Star,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }

  // Check if user has admin or content_manager role
  const [isAdmin, isContentManager] = await Promise.all([
    hasRole(db, session.user.id, "admin"),
    hasRole(db, session.user.id, "content_manager"),
  ]);

  if (!isAdmin && !isContentManager) {
    redirect("/");
  }

  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border/40 bg-card">
        <div className="flex h-full flex-col">
          {/* Admin Header */}
          <div className="border-b border-border/40 p-6">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Admin Panel
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.user.name ?? session.user.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border/40 p-4">
            <Link
              href="/"
              className="flex items-center justify-center rounded-md border border-border/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </>
  );
}

