import { z } from "zod";

// Paginated query schema
export const paginatedQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export type PaginatedQuery = z.infer<typeof paginatedQuerySchema>;

// Paginated response schema factory
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasMore: z.boolean(),
  });

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

// Helper function to calculate pagination
export function calculatePagination(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    totalPages,
    hasMore,
  };
}

// ========================================
// Geolocation Utilities
// ========================================

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ========================================
// Internationalization (i18n) Utilities
// ========================================

// Supported locales type
export type SupportedLocale = "ru" | "en";

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = "ru";

// All supported locales
export const SUPPORTED_LOCALES: SupportedLocale[] = ["ru", "en"];

/**
 * Type for translatable content fields
 */
export interface TranslatableContent {
  title?: string;
  excerpt?: string;
  content?: string;
  htmlContent?: string;
  name?: string;
  description?: string;
  address?: string;
}

/**
 * Type for translations JSON structure
 */
export type Translations = Record<string, TranslatableContent>;

/**
 * Get translated field value with fallback to default
 * @param defaultValue - The default value (in defaultLocale)
 * @param translations - The translations JSON object
 * @param locale - The requested locale
 * @param field - The field name to retrieve
 * @returns The translated value or default
 */
export function getTranslatedField<T extends keyof TranslatableContent>(
  defaultValue: string | null | undefined,
  translations: Translations | null | undefined,
  locale: string,
  field: T
): string | null {
  if (!translations || !locale || locale === DEFAULT_LOCALE) {
    return defaultValue ?? null;
  }
  
  const localeTranslations = translations[locale];
  if (localeTranslations?.[field]) {
    return localeTranslations[field] ?? defaultValue ?? null;
  }
  
  return defaultValue ?? null;
}

/**
 * Apply translations to an entity
 * Replaces the default fields with translated versions if available
 */
export function applyTranslations<T extends Record<string, unknown>>(
  entity: T,
  translations: Translations | null | undefined,
  locale: string,
  fields: (keyof TranslatableContent)[]
): T {
  if (!translations || !locale || locale === DEFAULT_LOCALE) {
    return entity;
  }
  
  const localeTranslations = translations[locale];
  if (!localeTranslations) {
    return entity;
  }
  
  const result = { ...entity };
  for (const field of fields) {
    if (localeTranslations[field] !== undefined) {
      (result as Record<string, unknown>)[field] = localeTranslations[field];
    }
  }
  
  return result;
}

