"use client";

import Link from "next/link";
import { 
  Menu, 
  User, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  Newspaper,
  BookOpen,
  Settings,
  CreditCard,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground" 
          aria-label="Открыть меню"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-left text-lg font-bold uppercase tracking-wider">
            Меню
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1">
          {/* Collapsible Categories Section */}
          {categories.length > 0 && (
            <>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="rounded-md px-4 py-4 text-sm font-bold uppercase tracking-wide hover:bg-accent hover:no-underline">
                    Направления
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="flex flex-col gap-1 pt-2">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="block rounded-md px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}

          {/* Static Navigation Items */}
          {staticNavItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-md px-4 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-accent hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <Separator className="mt-auto" />

        {/* User Info or Auth Buttons */}
        {session?.user ? (
          <div className="space-y-4 pb-[calc(var(--safe-bottom)+1rem)]">
            <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {session.user.name ?? "Пользователь"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            
            {/* User Space Links */}
            <div className="space-y-1">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Личный кабинет
              </p>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Главная
              </Link>
              <Link 
                href="/dashboard/events" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Мои события
              </Link>
              <Link 
                href="/dashboard/content" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Контент
              </Link>
              <Link 
                href="/dashboard/news" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <Newspaper className="h-4 w-4" />
                Новости
              </Link>
            </div>

            <Separator />
            
            {/* Settings Links */}
            <div className="space-y-1">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Settings className="inline-block h-3 w-3 mr-1" />
                Настройки
              </p>
              <Link 
                href="/dashboard/settings/profile" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4" />
                Профиль
              </Link>
              <Link 
                href="/dashboard/settings/subscription" 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Подписка
              </Link>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="w-full h-11 justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                asChild
              >
                <Link href="/api/auth/signout">
                  <LogOut className="h-4 w-4" />
                  Выйти
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-6 px-4 pb-[calc(var(--safe-bottom)+1rem)]">
            <Button className="w-full h-12" asChild>
              <Link href="/auth/sign-in">Войти</Link>
            </Button>
            <Button variant="outline" className="w-full h-12" asChild>
              <Link href="/auth/sign-up">Регистрация</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

