import { z } from "zod";

export const createTagDto = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const updateTagDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

export type CreateTagDto = z.infer<typeof createTagDto>;
export type UpdateTagDto = z.infer<typeof updateTagDto>;

