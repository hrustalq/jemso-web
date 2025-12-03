import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All supported locales
  locales: ["ru", "en"],

  // Default locale (Russian as primary)
  defaultLocale: "ru",

  // Hide default locale prefix (/about for ru, /en/about for en)
  localePrefix: "as-needed",

  // Locale detection cookie settings
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 31536000, // 1 year
    sameSite: "lax",
  },
});

export type Locale = (typeof routing.locales)[number];

