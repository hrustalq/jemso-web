import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const getNewsBySlugDto = z.object({
  slug: z.string(),
});

export const getNewsByIdDto = z.object({
  id: z.string(),
});

export const listNewsDto = paginatedQuerySchema.extend({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
});

export type GetNewsBySlugDto = z.infer<typeof getNewsBySlugDto>;
export type GetNewsByIdDto = z.infer<typeof getNewsByIdDto>;
export type ListNewsDto = z.infer<typeof listNewsDto>;

