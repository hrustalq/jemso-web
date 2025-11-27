import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const getPostBySlugDto = z.object({
  slug: z.string(),
});

export const getPostByIdDto = z.object({
  id: z.string(),
});

export const listPostsDto = paginatedQuerySchema.extend({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
});

export type GetPostBySlugDto = z.infer<typeof getPostBySlugDto>;
export type GetPostByIdDto = z.infer<typeof getPostByIdDto>;
export type ListPostsDto = z.infer<typeof listPostsDto>;

