import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { NewsletterForm } from "~/components/newsletter-form";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { AnimatedFooterWrapper } from "./animated-footer";

const staticFooterSections = [
  {
    title: "Сообщество",
    links: [
      { label: "Клуб", href: "/club" },
      { label: "Блог", href: "/blog" },
      { label: "Магазин", href: "/shop" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "/about" },
      { label: "Контакты", href: "/contact" },
      { label: "Конфиденциальность", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/jemso_drive/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@jemsodrive", label: "YouTube" },
  { icon: Facebook, href: "https://vk.com/jemso_drive", label: "VK" },
  { icon: Twitter, href: "https://t.me/jemsodrive", label: "Telegram" },
];

export async function Footer() {
  const session = await auth();
  
  // Load dynamic categories
  const categories = await api.blog.categories.navigation();

  // Dynamic categories section
  const categoriesSection = {
    title: "Мероприятия",
    links: [
      ...categories.slice(0, 3).map((category) => ({
        label: category.name,
        href: `/categories/${category.slug}`,
      })),
      { label: "Новости", href: "/news" },
    ],
  };

  // Dynamic account section based on auth state
  const accountSection = {
    title: session?.user ? "Аккаунт" : "Начать",
    links: session?.user
      ? [
          { label: "Профиль", href: "/account" },
          { label: "Настройки", href: "/account?tab=settings" },
          { label: "Подписка", href: "/account?tab=subscription" },
        ]
      : [
          { label: "Вход", href: "/auth/sign-in" },
          { label: "Регистрация", href: "/auth/sign-up" },
          { label: "Условия", href: "/terms" },
        ],
  };

  return (
    <AnimatedFooterWrapper>
      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* Brand Section - Responsive layout */}
            <div className="footer-section space-y-4 sm:col-span-2 lg:col-span-3">
              <Link href="/" className="inline-block transition-colors hover:text-primary">
                <span className="text-xl font-bold uppercase tracking-wider sm:text-2xl">
                  JEMSO
                </span>
              </Link>
              <p className="max-w-xs text-sm text-foreground/70">
                Радость в движении!
              </p>
              {/* Social Links - Responsive sizing */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-foreground/70 transition-colors hover:text-primary"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Section - Dynamic */}
            <div className="footer-section space-y-3 sm:space-y-4 lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {categoriesSection.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {categoriesSection.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Links Sections - Static */}
            {staticFooterSections.map((section) => (
              <div key={section.title} className="footer-section space-y-3 sm:space-y-4 lg:col-span-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Account Section - Dynamic based on auth state */}
            <div className="footer-section space-y-3 sm:space-y-4 lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {accountSection.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {accountSection.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section - Responsive layout */}
            <div className="footer-section sm:col-span-2 lg:col-span-3">
              <NewsletterForm />
            </div>
          </div>

          <Separator className="my-6 sm:my-8 lg:my-12" />

          {/* Legal Information - Required by Russian Law */}
          <div className="mb-6 space-y-3 rounded-lg border border-border/40 bg-card/50 p-4 text-xs text-foreground/70 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="font-semibold text-foreground">Наименование:</span>
                <p>ИП Хайбулаев Шамиль Магомедрашидович</p>
              </div>
              <div>
                <span className="font-semibold text-foreground">ИНН:</span>
                <p>056203350846</p>
              </div>
              <div>
                <span className="font-semibold text-foreground">ОГРНИП:</span>
                <p>319057100022896</p>
              </div>
              <div>
                <span className="font-semibold text-foreground">Email:</span>
                <p>
                  <a 
                    href="mailto:Jemsodrive@gmail.com"
                    className="transition-colors hover:text-primary"
                  >
                    Jemsodrive@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <span className="font-semibold text-foreground">Телефон:</span>
                <p>
                  <a 
                    href="tel:+79887725757"
                    className="transition-colors hover:text-primary"
                  >
                    +7 988 772-57-57
                  </a>
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Link 
                  href="/contact"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Полные реквизиты →
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-foreground/70 sm:flex-row sm:gap-4 sm:text-left">
            <p className="order-2 sm:order-1">
              © {new Date().getFullYear()} Jemso. Все права защищены.
            </p>
            <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row sm:gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Условия использования
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedFooterWrapper>
  );
}

