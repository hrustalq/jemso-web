"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">Меню</SheetTitle>
        </SheetHeader>

        {/* Auth Buttons - Mobile Only (hidden when desktop auth buttons are visible) */}
        {!session?.user && (
          <div className="mt-4 flex flex-col gap-2 sm:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/sign-in">Вход</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">Регистрация</Link>
            </Button>
            <Separator className="my-2" />
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col space-y-1">
          {/* Collapsible Categories Section */}
          {categories.length > 0 && (
            <>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <span>Направления</span>
                {categoriesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  categoriesOpen ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="space-y-1 pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
            </>
          )}

          {/* Static Navigation Items */}
          {staticNavItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

