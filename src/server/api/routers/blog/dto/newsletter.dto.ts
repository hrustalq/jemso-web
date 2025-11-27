import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const subscribeNewsletterDto = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
});

export const subscribeToCategoryDto = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  categoryId: z.string(),
});

export const unsubscribeNewsletterDto = z.object({
  email: z.string().email(),
});

export const confirmSubscriptionDto = z.object({
  id: z.string(),
});

export const listSubscribersDto = paginatedQuerySchema.extend({
  active: z.boolean().optional(),
  confirmed: z.boolean().optional(),
});

export type SubscribeNewsletterDto = z.infer<typeof subscribeNewsletterDto>;
export type SubscribeToCategoryDto = z.infer<typeof subscribeToCategoryDto>;
export type UnsubscribeNewsletterDto = z.infer<typeof unsubscribeNewsletterDto>;
export type ConfirmSubscriptionDto = z.infer<typeof confirmSubscriptionDto>;
export type ListSubscribersDto = z.infer<typeof listSubscribersDto>;

