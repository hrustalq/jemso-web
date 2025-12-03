"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  BookOpen,
  User,
  Lock,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";

export function UserSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  const mainNavItems = [
    {
      title: t("nav.home"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.myEvents"),
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: t("nav.content"),
      href: "/dashboard/content",
      icon: BookOpen,
    },
    {
      title: t("nav.news"),
      href: "/dashboard/news",
      icon: Newspaper,
    },
  ];

  const settingsNavItems = [
    {
      title: t("nav.profile"),
      href: "/dashboard/settings/profile",
      icon: User,
    },
    {
      title: t("nav.security"),
      href: "/dashboard/settings/security",
      icon: Lock,
    },
    {
      title: t("nav.notifications"),
      href: "/dashboard/settings/notifications",
      icon: Bell,
    },
    {
      title: t("nav.subscription"),
      href: "/dashboard/settings/subscription",
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("sidebar.personalCabinet")}
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}

        <Separator className="my-4" />

        {/* Settings Navigation */}
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Settings className="mr-2 inline-block h-3 w-3" />
          {t("sidebar.settings")}
        </p>
        {settingsNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pt-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          {t("sidebar.backToSite")}
        </Link>
      </div>
    </div>
  );
}

