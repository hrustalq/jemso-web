import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";

export const updateBlogPostDto = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(), // Legacy content
  blocks: blocksArraySchema.optional(), // Legacy: structured block content (deprecated, use htmlContent)
  htmlContent: z.string().optional(), // New: CKEditor HTML content (preferred)
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  minTier: z.number().int().min(0).optional(),
});

export type UpdateBlogPostDto = z.infer<typeof updateBlogPostDto>;
