"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Settings,
} from "lucide-react";

const navItems = [
  {
    title: "Главная",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "События",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Новости",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "Настройки",
    href: "/dashboard/settings/profile",
    icon: Settings,
  },
];

export function UserMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 safe-pb">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

