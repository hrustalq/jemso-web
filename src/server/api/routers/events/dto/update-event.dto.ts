import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";
import { eventTranslationsSchema } from "./create-event.dto";

export const updateEventDto = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(), // Legacy content
  blocks: blocksArraySchema.optional(), // Legacy: structured block content (deprecated, use htmlContent)
  htmlContent: z.string().optional(), // New: CKEditor HTML content (preferred)
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  minTier: z.number().int().min(0).optional(),
  
  // i18n fields
  defaultLocale: z.string().length(2).optional(),
  translations: eventTranslationsSchema,
  
  // Event-specific fields
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  
  // Location fields - Enhanced for geolocation
  location: z.string().max(500).optional().nullable(),
  locationUrl: z.string().url().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().length(2).optional().nullable(), // ISO 3166-1 alpha-2
  timezone: z.string().max(50).optional().nullable(),
  isOnline: z.boolean().optional(),
  onlineUrl: z.string().url().optional().nullable(),
  venueId: z.string().optional().nullable(),
  
  maxParticipants: z.number().int().positive().optional().nullable(),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    // If coordinates are provided, both must be present (or both null)
    if (data.latitude !== undefined && data.longitude !== undefined) {
      if (data.latitude === null && data.longitude === null) return true;
      if (data.latitude !== null && data.longitude !== null) return true;
      return false;
    }
    return true;
  },
  {
    message: "Both latitude and longitude must be provided together",
    path: ["latitude"],
  }
);

export type UpdateEventDto = z.infer<typeof updateEventDto>;
