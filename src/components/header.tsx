import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { auth } from "~/server/auth";
import { HeaderNav } from "./header-nav";
import { UserMenu } from "./user-menu";
import { Button } from "~/components/ui/button";
import { AnimatedHeaderWrapper } from "./animated-header";
import { User } from "lucide-react";
import { api } from "~/trpc/server";
import { Link } from "~/i18n/navigation";
import { LanguageSwitcherCompact } from "./language-switcher";

// Social media links
const socialLinks = [
  { icon: "facebook", href: "#", label: "Facebook" },
  { icon: "x", href: "#", label: "X (Twitter)" },
  { icon: "youtube", href: "#", label: "YouTube" },
  { icon: "instagram", href: "#", label: "Instagram" },
] as const;

// Social icon SVG components
const SocialIcon = ({ icon }: { icon: string }) => {
  const iconPaths: Record<string, string> = {
    facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    x: "M4 4l11.733 16h4.267l-11.733-16zm0 16l11.733-16h4.267l-11.733 16z",
    youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l0-6.53 5.75 3.27z",
    instagram: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
  };

  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[icon]} />
    </svg>
  );
};

export async function Header() {
  const t = await getTranslations("Navigation");
  const session = await auth();
  
  // Load dynamic categories for navigation
  const categories = await api.blog.categories.navigation();

  // Translated static navigation items
  const staticNavItems = [
    { title: t("news"), href: "/news" },
    { title: t("shop"), href: "/shop" },
    { title: t("blog"), href: "/blog" },
    { title: t("about"), href: "/about" },
    { title: t("contact"), href: "/contact" },
  ];

  return (
    <AnimatedHeaderWrapper>
      <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pt-(--safe-top)">
        {/* Top Bar */}
        <div 
          className="border-b border-border/40"
        >
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:h-20 pl-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))]">
            {/* Left Section: Burger Menu (mobile) / Social Links (desktop) */}
            <div className="flex items-center gap-2">
              {/* Hamburger Menu - Left on mobile, right on desktop */}
              <div className="md:hidden">
                <HeaderNav 
                  categories={categories}
                  staticNavItems={staticNavItems}
                  session={session} 
                />
              </div>
              
              {/* Social Links - Hidden on mobile, visible on tablet+ */}
              {socialLinks.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  className="group hidden h-9 w-9 items-center justify-center rounded-full border border-border/40 transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary md:flex"
                  aria-label={social.label}
                >
                  <SocialIcon icon={social.icon} />
                </Link>
              ))}
            </div>

            {/* Center Section: Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 hover:scale-105 hover:opacity-90"
            >
              <Image
                src="/logo.png"
                alt="JEMSO"
                width={110}
                height={37}
                className="h-[16px] w-auto sm:h-[19px]"
                priority
              />
            </Link>

            {/* Right Section: User Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcherCompact />

              {/* My Page / Auth */}
              {session?.user ? (
                <UserMenu user={session.user} />
              ) : (
                <>
                  {/* Mobile: Icon only */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex h-9 w-9 items-center justify-center p-0 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:hidden" 
                    asChild
                  >
                    <Link href="/auth/sign-in">
                      <User className="h-4 w-4" />
                      <span className="sr-only">{t("myProfile")}</span>
                    </Link>
                  </Button>
                  
                  {/* Desktop: Icon + Text */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden h-9 gap-2 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:flex" 
                    asChild
                  >
                    <Link href="/auth/sign-in">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{t("myProfile")}</span>
                    </Link>
                  </Button>
                </>
              )}

              {/* Hamburger Menu - Hidden on mobile (shown on left), visible on desktop */}
              <div className="hidden md:block">
                <HeaderNav 
                  categories={categories}
                  staticNavItems={staticNavItems}
                  session={session} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Second Layer - Hidden on mobile (< md) */}
        <div className="hidden md:block border-b border-border/40 overflow-hidden" data-nav-bar>
          <div className="container mx-auto px-4 pl-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))]">
            <nav className="flex items-center justify-center gap-6 py-3 sm:gap-8 sm:py-4">
              {staticNavItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="relative text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </AnimatedHeaderWrapper>
  );
}
