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

