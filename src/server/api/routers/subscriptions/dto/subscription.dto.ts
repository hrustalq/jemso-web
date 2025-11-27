import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createSubscriptionDto = z.object({
  userId: z.string(),
  planId: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethod: z.string().optional(),
});

export const updateSubscriptionDto = z.object({
  id: z.string(),
  status: z.enum(["active", "canceled", "expired", "trial"]).optional(),
  endDate: z.date().optional(),
  autoRenew: z.boolean().optional(),
  paymentMethod: z.string().optional(),
});

export const cancelSubscriptionDto = z.object({
  id: z.string(),
  reason: z.string().max(500).optional(),
});

export const listSubscriptionsDto = paginatedQuerySchema.extend({
  userId: z.string().optional(),
  planId: z.string().optional(),
  status: z.enum(["active", "canceled", "expired", "trial"]).optional(),
});

export const checkFeatureDto = z.object({
  userId: z.string(),
  featureSlug: z.string(),
});

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionDto>;
export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionDto>;
export type CancelSubscriptionDto = z.infer<typeof cancelSubscriptionDto>;
export type ListSubscriptionsDto = z.infer<typeof listSubscriptionsDto>;
export type CheckFeatureDto = z.infer<typeof checkFeatureDto>;

