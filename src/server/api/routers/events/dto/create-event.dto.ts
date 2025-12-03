import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";

// Schema for event translations
export const eventTranslationsSchema = z.record(
  z.string(), // locale code (e.g., "en", "ru")
  z.object({
    title: z.string().max(255).optional(),
    excerpt: z.string().max(500).optional(),
    content: z.string().optional(),
    htmlContent: z.string().optional(),
  })
).optional();

export const createEventDto = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(), // Legacy: for backward compatibility
  blocks: blocksArraySchema.optional(), // Legacy: structured block content (deprecated, use htmlContent)
  htmlContent: z.string().optional(), // New: CKEditor HTML content (preferred)
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  minTier: z.number().int().min(0).default(0),
  
  // i18n fields
  defaultLocale: z.string().length(2).default("ru"),
  translations: eventTranslationsSchema,
  
  // Event-specific fields
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  
  // Location fields - Enhanced for geolocation
  location: z.string().max(500).optional(),
  locationUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  city: z.string().max(100).optional(),
  country: z.string().length(2).optional(), // ISO 3166-1 alpha-2
  timezone: z.string().max(50).optional(),
  isOnline: z.boolean().default(false),
  onlineUrl: z.string().url().optional(),
  venueId: z.string().optional(),
  
  maxParticipants: z.number().int().positive().optional(),
  price: z.number().nonnegative().default(0),
  currency: z.string().length(3).default("USD"),
}).refine(
  (data) => data.content ?? data.htmlContent ?? (data.blocks && data.blocks.length > 0),
  {
    message: "Either content, htmlContent, or blocks must be provided",
    path: ["content"],
  }
).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    // If coordinates are provided, both must be present
    if (data.latitude !== undefined || data.longitude !== undefined) {
      return data.latitude !== undefined && data.longitude !== undefined;
    }
    return true;
  },
  {
    message: "Both latitude and longitude must be provided together",
    path: ["latitude"],
  }
);

export type CreateEventDto = z.infer<typeof createEventDto>;
export type EventTranslations = z.infer<typeof eventTranslationsSchema>;
