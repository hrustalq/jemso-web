import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(), 
  htmlContent: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  minTier: z.number().int().min(0).default(0),
});

export const createNewsDto = createNewsSchema.refine(
  (data) => data.content ?? data.htmlContent,
  {
    message: "Either content or htmlContent must be provided",
    path: ["content"],
  }
);

export type CreateNewsDto = z.infer<typeof createNewsDto>;
