import { z } from "zod";

export const createCategoryDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  coverVideo: z.string().url().optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  showInNav: z.boolean().default(true),
});

export const updateCategoryDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional(),
  coverImage: z.string().url().optional().nullable(),
  coverVideo: z.string().url().optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  showInNav: z.boolean().optional(),
});

export const getCategoryDto = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id ?? data.slug, {
  message: "Either id or slug must be provided",
});

export const listCategoriesDto = z.object({
  showInNav: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type GetCategoryDto = z.infer<typeof getCategoryDto>;
export type ListCategoriesDto = z.infer<typeof listCategoriesDto>;

