"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserMenu } from "~/components/user-menu";

// Page title mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Главная",
  "/dashboard/events": "Мои события",
  "/dashboard/content": "Контент",
  "/dashboard/news": "Новости",
  "/dashboard/settings/profile": "Профиль",
  "/dashboard/settings/security": "Безопасность",
  "/dashboard/settings/notifications": "Уведомления",
  "/dashboard/settings/subscription": "Подписка",
};

interface UserHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserHeader({ user }: UserHeaderProps) {
  const pathname = usePathname();
  
  // Get current page title
  const currentPageTitle = pageTitles[pathname] ?? "Личный кабинет";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pt-[var(--safe-top)] lg:left-64">
      <div className="relative flex h-16 items-center justify-between px-4 md:px-6 pl-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))]">
        {/* Left Section: Current Page Title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wide text-foreground">
            {currentPageTitle}
          </span>
        </div>

        {/* Center Section: Logo */}
        <Link
          href="/dashboard"
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 hover:scale-105 hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="JEMSO"
            width={110}
            height={37}
            className="h-[16px] w-auto sm:h-[18px]"
            priority
          />
        </Link>

        {/* Right Section: User Menu */}
        <div className="flex items-center gap-2">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
