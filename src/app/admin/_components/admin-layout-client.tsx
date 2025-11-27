"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";

const adminNavItems = [
  {
    title: "Панель управления",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "События",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Статьи блога",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Новости",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Категории",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    title: "Тарифные планы",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    title: "Функции",
    href: "/admin/features",
    icon: Star,
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName: string | null;
  userEmail: string | null;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header 
        className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="relative flex h-16 items-center justify-center px-4 md:px-6">
          {/* Mobile Menu Button - Absolute Left */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Переключить меню</span>
          </Button>

          {/* Logo - Centered */}
          <Link href="/admin" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="JEMSO"
              width={110}
              height={37}
              className="h-[16px] w-auto sm:h-[19px]"
              priority
            />
          </Link>
        </div>
      </header>

      <div className="flex pt-16" style={{ paddingTop: 'calc(4rem + var(--safe-top))' }}>
        {/* Desktop Sidebar */}
        <aside 
          className="fixed left-0 hidden h-[calc(100vh-4rem-var(--safe-top))] w-64 border-r border-border/40 bg-card lg:block"
          style={{ 
            top: 'calc(4rem + var(--safe-top))',
            paddingLeft: 'var(--safe-left)'
          }}
        >
          <nav className="h-full overflow-y-auto p-4">
            <ul className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Back to Site Button */}
            <div className="mt-4 border-t border-border/40 pt-4">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Вернуться на сайт
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              style={{ top: 'calc(4rem + var(--safe-top))' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside 
              className="fixed left-0 z-50 h-[calc(100vh-4rem-var(--safe-top))] w-64 border-r border-border/40 bg-card lg:hidden"
              style={{ 
                top: 'calc(4rem + var(--safe-top))',
                paddingLeft: 'var(--safe-left)',
                paddingBottom: 'var(--safe-bottom)'
              }}
            >
              <nav className="h-full overflow-y-auto p-4">
                <ul className="space-y-1">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile Back to Site Button */}
                <div className="mt-4 border-t border-border/40 pt-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Вернуться на сайт
                    </Button>
                  </Link>
                </div>
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main 
          className="min-h-[calc(100vh-4rem-var(--safe-top))] overflow-y-auto overflow-x-hidden flex-1 lg:ml-64"
          style={{ paddingRight: 'var(--safe-right)' }}
        >
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
