import Link from "next/link";
import { auth } from "~/server/auth";
import { HeaderNav } from "./header-nav";
import { UserMenu } from "./user-menu";
import { Button } from "~/components/ui/button";
import { AnimatedHeaderWrapper } from "./animated-header";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { api } from "~/trpc/server";

// Static navigation items
const staticNavItems = [
  { title: "Новости", href: "/news" },
  { title: "Магазин", href: "/shop" },
  { title: "Блог", href: "/blog" },
  { title: "О нас", href: "/about" },
  { title: "Контакты", href: "/contact" },
];

export async function Header() {
  const session = await auth();
  
  // Load dynamic categories for navigation
  const categories = await api.blog.categories.navigation();

  return (
    <AnimatedHeaderWrapper>
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:gap-4" style={{ paddingLeft: 'max(1rem, var(--safe-left))', paddingRight: 'max(1rem, var(--safe-right))' }}>
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center transition-colors hover:text-primary"
          >
            <span className="text-lg font-bold uppercase tracking-wider sm:text-xl lg:text-2xl">
              JEMSO
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet, visible on large screens */}
          <div className="hidden flex-1 justify-center lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium uppercase tracking-wide">
                    Направления
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-2">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/categories/${category.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {category.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
              {/* Static navigation items */}
              {staticNavItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {item.title}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Spacer for mobile when no nav is visible */}
          <div className="flex-1 lg:hidden" />

          {/* Auth Section */}
          <div className="flex shrink-0 items-center gap-2">
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                {/* Desktop Auth Buttons - Hidden on small mobile, visible on small screens and up */}
                <div className="hidden items-center gap-2 sm:flex">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm" asChild>
                    <Link href="/auth/sign-in">Вход</Link>
                  </Button>
                  <Button size="sm" className="text-xs sm:text-sm" asChild>
                    <Link href="/auth/sign-up">Регистрация</Link>
                  </Button>
                </div>
              </>
            )}

            {/* Mobile Navigation Toggle - Hidden on large screens where desktop nav is shown */}
            <div className="lg:hidden">
              <HeaderNav 
                categories={categories}
                staticNavItems={staticNavItems}
                session={session} 
              />
            </div>
          </div>
        </div>
      </header>
    </AnimatedHeaderWrapper>
  );
}

