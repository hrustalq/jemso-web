"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  Menu, 
  User, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  Newspaper,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import type { Session } from "next-auth";

interface HeaderNavProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  }>;
  staticNavItems: Array<{ title: string; href: string }>;
  session: Session | null;
}

export function HeaderNav({ categories, staticNavItems, session }: HeaderNavProps) {
  const t = useTranslations("HeaderNav");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground" 
          aria-label={t("openMenu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col p-0">
        <SheetHeader className="border-b border-border px-4 py-3 shrink-0">
          <SheetTitle className="text-left text-lg font-bold uppercase tracking-wider">
            {t("menu")}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("menuDescription")}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Navigation Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <nav className="flex flex-col">
            {/* Collapsible Categories Section */}
            {categories.length > 0 && (
              <div className="w-full">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-accent transition-colors"
                >
                  <span>{t("categories")}</span>
                  {categoriesOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {categoriesOpen && (
                  <div className="flex flex-col bg-accent/30">
                    {categories.map((category) => (
                      <SheetClose key={category.slug} asChild>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="block px-6 py-2.5 text-sm transition-colors hover:bg-accent hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Static Navigation Items */}
            {staticNavItems.map((item) => (
              <SheetClose key={item.title} asChild>
                <Link
                  href={item.href}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-accent hover:text-primary"
                >
                  {item.title}
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* User Dashboard Links - Scrollable with nav when logged in */}
          {session?.user && (
            <>
              <Separator />
              <div>
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("personalCabinet")}
                </p>
                <SheetClose asChild>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link 
                    href="/dashboard/events" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    {t("myEvents")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link 
                    href="/dashboard/content" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    {t("content")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link 
                    href="/dashboard/news" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <Newspaper className="h-4 w-4" />
                    {t("news")}
                  </Link>
                </SheetClose>
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer Section */}
        <div className="shrink-0 border-t border-border pb-[var(--safe-bottom)]">
          {session?.user ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-accent/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {session.user.name ?? t("user")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
              
              {/* Settings Links */}
              <div className="border-t border-border">
                <SheetClose asChild>
                  <Link 
                    href="/dashboard/settings/profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t("settings")}
                  </Link>
                </SheetClose>
                <Link 
                  href="/api/auth/signout"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t("signOut")}
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              <SheetClose asChild>
                <Button className="w-full h-10" asChild>
                  <Link href="/auth/sign-in">{t("signIn")}</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full h-10" asChild>
                  <Link href="/auth/sign-up">{t("signUp")}</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
