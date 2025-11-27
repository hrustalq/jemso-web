import { z } from "zod";

export const createFeatureDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  featureType: z.enum(["boolean", "numeric", "text"]).default("boolean"),
});

export const updateFeatureDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional(),
  featureType: z.enum(["boolean", "numeric", "text"]).optional(),
});

export type CreateFeatureDto = z.infer<typeof createFeatureDto>;
export type UpdateFeatureDto = z.infer<typeof updateFeatureDto>;

