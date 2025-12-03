import { z } from "zod";

export const updatePreferencesDto = z.object({
  emailNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  newsletterSubscribed: z.boolean().optional(),
});

export type UpdatePreferencesDto = z.infer<typeof updatePreferencesDto>;

export const userPreferencesOutputDto = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  newsletterSubscribed: z.boolean(),
});

export type UserPreferencesOutputDto = z.infer<typeof userPreferencesOutputDto>;

// Location preferences DTO
export const updateLocationPreferencesDto = z.object({
  preferredLocale: z.string().length(2).optional(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().length(2).optional().nullable(), // ISO 3166-1 alpha-2
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
  maxEventDistance: z.number().positive().optional().nullable(), // km
}).refine(
  (data) => {
    // If coordinates are provided, both must be present
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

export type UpdateLocationPreferencesDto = z.infer<typeof updateLocationPreferencesDto>;

export const locationPreferencesOutputDto = z.object({
  preferredLocale: z.string(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  timezone: z.string().nullable(),
  maxEventDistance: z.number().nullable(),
});

export type LocationPreferencesOutputDto = z.infer<typeof locationPreferencesOutputDto>;

