import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Separator } from "~/components/ui/separator";
import { AnimatedFooterWrapper } from "./animated-footer";
import { NewsletterForm } from "./newsletter-form";
import { Link } from "~/i18n/navigation";
import type { Session } from "next-auth";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/jemso_drive/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@jemsodrive", label: "YouTube" },
  { icon: Facebook, href: "https://vk.com/jemso_drive", label: "VK" },
  { icon: Twitter, href: "https://t.me/jemsodrive", label: "Telegram" },
];

interface FooterProps {
  session?: Session | null;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  }>;
}

export async function Footer({ session: propSession, categories: propCategories }: FooterProps = {}) {
  const t = await getTranslations("Footer");
  
  // Use passed props or defaults (for backwards compatibility)
  const session = propSession ?? null;
  const categories = propCategories ?? [];

  // Dynamic categories section
  const categoriesSection = {
    title: t("sections.events"),
    links: [
      ...categories.slice(0, 3).map((category) => ({
        label: category.name,
        href: `/categories/${category.slug}`,
      })),
      { label: t("links.news"), href: "/news" },
    ],
  };

  const staticFooterSections = [
    {
      title: t("sections.community"),
      links: [
        { label: t("links.club"), href: "/club" },
        { label: t("links.blog"), href: "/blog" },
        { label: t("links.shop"), href: "/shop" },
      ],
    },
    {
      title: t("sections.company"),
      links: [
        { label: t("links.about"), href: "/about" },
        { label: t("links.contact"), href: "/contact" },
        { label: t("links.privacy"), href: "/privacy" },
      ],
    },
  ];

  // Dynamic account section based on auth state
  const accountSection = {
    title: session?.user ? t("sections.account") : t("sections.getStarted"),
    links: session?.user
      ? [
          { label: t("links.profile"), href: "/account" },
          { label: t("links.settings"), href: "/account?tab=settings" },
          { label: t("links.subscription"), href: "/account?tab=subscription" },
        ]
      : [
          { label: t("links.signIn"), href: "/auth/sign-in" },
          { label: t("links.signUp"), href: "/auth/sign-up" },
          { label: t("links.terms"), href: "/terms" },
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
                  {t("company")}
                </span>
              </Link>
              <p className="max-w-xs text-sm text-foreground/70">
                {t("slogan")}
              </p>
              {/* Social Links - Responsive sizing */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-foreground/70 transition-colors hover:text-primary"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
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
          <div className="mb-6 rounded-lg p-4 text-sm text-foreground/90">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
              <div>
                <span className="font-medium text-foreground">{t("legal.entity")}</span>
              </div>
              <div className="text-foreground/80">
                <span className="font-medium">{t("legal.inn")}:</span> 056203350846
              </div>
              <div className="text-foreground/80">
                <span className="font-medium">{t("legal.ogrn")}:</span> 319057100022896
              </div>
              <div>
                <a 
                  href="mailto:Jemsodrive@gmail.com"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  Jemsodrive@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-foreground/70 sm:flex-row sm:gap-4 sm:text-left">
            <p className="order-2 sm:order-1">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row sm:gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                {t("links.privacyFull")}
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                {t("links.terms")}
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                {t("links.contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedFooterWrapper>
  );
}
