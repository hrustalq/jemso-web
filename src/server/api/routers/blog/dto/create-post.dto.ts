import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";

export const createBlogPostDto = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(), // Legacy: for backward compatibility
  blocks: blocksArraySchema.optional(), // Legacy: structured block content (deprecated, use htmlContent)
  htmlContent: z.string().optional(), // New: CKEditor HTML content (preferred)
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  minTier: z.number().int().min(0).default(0),
}).refine(
  (data) => data.content ?? data.htmlContent ?? (data.blocks && data.blocks.length > 0),
  {
    message: "Either content, htmlContent, or blocks must be provided",
    path: ["content"],
  }
);

export type CreateBlogPostDto = z.infer<typeof createBlogPostDto>;
