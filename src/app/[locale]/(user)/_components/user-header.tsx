"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserMenu } from "~/components/user-menu";

interface UserHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserHeader({ user }: UserHeaderProps) {
  const pathname = usePathname();
  const t = useTranslations("UserHeader");
  
  // Page title mapping using translations
  const getPageTitle = () => {
    // Remove locale prefix from pathname for matching
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    const titleMap: Record<string, string> = {
      "/dashboard": t("dashboard"),
      "/dashboard/events": t("myEvents"),
      "/dashboard/content": t("content"),
      "/dashboard/news": t("news"),
      "/dashboard/settings/profile": t("profile"),
      "/dashboard/settings/security": t("security"),
      "/dashboard/settings/notifications": t("notifications"),
      "/dashboard/settings/subscription": t("subscription"),
    };
    
    return titleMap[pathWithoutLocale] ?? t("personalCabinet");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pt-(--safe-top) lg:left-64">
      <div className="relative flex h-16 items-center justify-between gap-2 px-3 sm:px-4 md:px-6 pl-[max(0.75rem,var(--safe-left))] sm:pl-[max(1rem,var(--safe-left))] pr-[max(0.75rem,var(--safe-right))] sm:pr-[max(1rem,var(--safe-right))]">
        {/* Left Section: Current Page Title */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wide text-foreground truncate max-w-[120px] sm:max-w-none">
            {getPageTitle()}
          </span>
        </div>

        {/* Center Section: Logo */}
        <Link
          href="/dashboard"
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 hover:scale-105 hover:opacity-90 hidden sm:block"
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
        <div className="flex items-center gap-2 shrink-0">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
