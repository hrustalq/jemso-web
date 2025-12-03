import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

// Schema for venue translations
export const venueTranslationsSchema = z.record(
  z.string(), // locale code
  z.object({
    name: z.string().max(255).optional(),
    description: z.string().optional(),
    address: z.string().max(500).optional(),
  })
).optional();

export const createVenueDto = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  
  // Location details
  address: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  country: z.string().length(2), // ISO 3166-1 alpha-2
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().max(50).optional(),
  
  // Venue metadata
  capacity: z.number().int().positive().optional(),
  website: z.string().url().optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().optional(),
  mapUrl: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  amenities: z.array(z.string()).optional(),
  
  // i18n
  defaultLocale: z.string().length(2).default("ru"),
  translations: venueTranslationsSchema,
  
  isActive: z.boolean().default(true),
});

export const updateVenueDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().optional().nullable(),
  
  // Location details
  address: z.string().max(500).optional().nullable(),
  city: z.string().min(1).max(100).optional(),
  country: z.string().length(2).optional(),
  postalCode: z.string().max(20).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  timezone: z.string().max(50).optional().nullable(),
  
  // Venue metadata
  capacity: z.number().int().positive().optional().nullable(),
  website: z.string().url().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().optional().nullable(),
  mapUrl: z.string().url().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  
  // i18n
  defaultLocale: z.string().length(2).optional(),
  translations: venueTranslationsSchema,
  
  isActive: z.boolean().optional(),
});

export const getVenueDto = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  locale: z.string().length(2).optional(),
}).refine(
  (data) => data.id ?? data.slug,
  { message: "Either id or slug must be provided" }
);

export const listVenuesDto = paginatedQuerySchema.extend({
  city: z.string().optional(),
  country: z.string().length(2).optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  locale: z.string().length(2).optional(),
  
  // Geolocation filtering
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  maxDistance: z.number().positive().optional(),
  sortByDistance: z.boolean().optional(),
});

export type CreateVenueDto = z.infer<typeof createVenueDto>;
export type UpdateVenueDto = z.infer<typeof updateVenueDto>;
export type GetVenueDto = z.infer<typeof getVenueDto>;
export type ListVenuesDto = z.infer<typeof listVenuesDto>;
export type VenueTranslations = z.infer<typeof venueTranslationsSchema>;

