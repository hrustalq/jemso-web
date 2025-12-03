"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "~/i18n/navigation";
import { routing, type Locale } from "~/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

const localeConfig: Record<Locale, { name: string; flag: string; shortName: string }> = {
  ru: { name: "Русский", flag: "🇷🇺", shortName: "RU" },
  en: { name: "English", flag: "🇬🇧", shortName: "EN" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex h-10 items-center gap-2.5 rounded-lg border border-border/50 bg-card/50 px-3 text-sm font-medium transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-lg leading-none">{localeConfig[locale].flag}</span>
          <span className="hidden sm:inline">{localeConfig[locale].name}</span>
          <span className="sm:hidden">{localeConfig[locale].shortName}</span>
          <svg
            className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60] min-w-[140px] p-1.5">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleChange(loc)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              locale === loc && "bg-primary/10 text-primary"
            )}
          >
            <span className="text-lg leading-none">{localeConfig[loc].flag}</span>
            <span className="font-medium">{localeConfig[loc].name}</span>
            {locale === loc && (
              <svg
                className="ml-auto h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for header - minimal footprint with elegant interaction
export function LanguageSwitcherCompact() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:gap-1.5 sm:rounded-lg sm:px-2.5"
          aria-label="Change language"
        >
          <span className="text-base leading-none">{localeConfig[locale].flag}</span>
          <span className="hidden text-xs font-medium uppercase tracking-wide sm:inline">
            {localeConfig[locale].shortName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="z-[60] min-w-[160px] overflow-hidden rounded-xl border border-border/50 bg-popover/95 p-1.5 shadow-lg backdrop-blur-sm">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleChange(loc)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
              locale === loc 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-accent"
            )}
          >
            <span className="text-lg leading-none">{localeConfig[loc].flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{localeConfig[loc].name}</span>
              <span className="text-xs text-muted-foreground">{localeConfig[loc].shortName}</span>
            </div>
            {locale === loc && (
              <svg
                className="ml-auto h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
