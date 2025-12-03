import { z } from "zod";
import { paginatedQuerySchema, SUPPORTED_LOCALES } from "~/server/api/utils";

export const getPostBySlugDto = z.object({
  slug: z.string(),
  locale: z.enum(SUPPORTED_LOCALES as [string, ...string[]]).optional(),
});

export const getPostByIdDto = z.object({
  id: z.string(),
  locale: z.enum(SUPPORTED_LOCALES as [string, ...string[]]).optional(),
});

export const listPostsDto = paginatedQuerySchema.extend({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  locale: z.enum(SUPPORTED_LOCALES as [string, ...string[]]).optional(),
});

export type GetPostBySlugDto = z.infer<typeof getPostBySlugDto>;
export type GetPostByIdDto = z.infer<typeof getPostByIdDto>;
export type ListPostsDto = z.infer<typeof listPostsDto>;

