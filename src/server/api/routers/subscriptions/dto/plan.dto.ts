import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createPlanDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  currency: z.string().length(3).default("USD"),
  billingInterval: z.enum(["month", "year", "lifetime"]).default("month"),
  trialDays: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  maxUsers: z.number().int().positive().optional(),
  maxStorage: z.number().int().positive().optional(),
  order: z.number().int().default(0),
  featureIds: z.array(z.object({
    featureId: z.string(),
    value: z.string().optional(),
  })).optional(),
});

export const updatePlanDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  billingInterval: z.enum(["month", "year", "lifetime"]).optional(),
  trialDays: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  maxUsers: z.number().int().positive().nullable().optional(),
  maxStorage: z.number().int().positive().nullable().optional(),
  order: z.number().int().optional(),
  featureIds: z.array(z.object({
    featureId: z.string(),
    value: z.string().optional(),
  })).optional(),
});

export const getPlanDto = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id ?? data.slug, {
  message: "Either id or slug must be provided",
});

export const listPlansDto = paginatedQuerySchema.extend({
  isActive: z.boolean().optional(),
});

export type CreatePlanDto = z.infer<typeof createPlanDto>;
export type UpdatePlanDto = z.infer<typeof updatePlanDto>;
export type GetPlanDto = z.infer<typeof getPlanDto>;
export type ListPlansDto = z.infer<typeof listPlansDto>;

