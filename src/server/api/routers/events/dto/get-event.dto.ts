import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const getEventBySlugDto = z.object({
  slug: z.string(),
  locale: z.string().length(2).optional(), // Request specific locale for translations
});

export const listEventsDto = paginatedQuerySchema.extend({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  upcoming: z.boolean().optional(), // Filter for upcoming events
  past: z.boolean().optional(), // Filter for past events
  
  // i18n filter
  locale: z.string().length(2).optional(), // Request specific locale for translations
  
  // Location-based filtering
  city: z.string().optional(), // Filter by city
  country: z.string().length(2).optional(), // Filter by country (ISO 3166-1 alpha-2)
  isOnline: z.boolean().optional(), // Filter for online events only
  
  // Geolocation-based filtering (for "near me" functionality)
  latitude: z.number().min(-90).max(90).optional(), // User's latitude
  longitude: z.number().min(-180).max(180).optional(), // User's longitude
  maxDistance: z.number().positive().optional(), // Max distance in kilometers
  sortByDistance: z.boolean().optional(), // Sort results by distance
  
  // Venue filter
  venueId: z.string().optional(),
});

export type GetEventBySlugDto = z.infer<typeof getEventBySlugDto>;
export type ListEventsDto = z.infer<typeof listEventsDto>;

