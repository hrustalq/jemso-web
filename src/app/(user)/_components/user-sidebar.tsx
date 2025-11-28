"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const mainNavItems = [
  {
    title: "Главная",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Мои события",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Контент",
    href: "/dashboard/content",
    icon: BookOpen,
  },
  {
    title: "Новости",
    href: "/dashboard/news",
    icon: Newspaper,
  },
];

const settingsNavItems = [
  {
    title: "Профиль",
    href: "/dashboard/settings/profile",
    icon: User,
  },
  {
    title: "Безопасность",
    href: "/dashboard/settings/security",
    icon: Lock,
  },
  {
    title: "Уведомления",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Подписка",
    href: "/dashboard/settings/subscription",
    icon: CreditCard,
  },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Личный кабинет
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
          Настройки
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
          Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}

