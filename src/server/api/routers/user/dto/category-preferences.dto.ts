import { z } from "zod";

export const addCategoryPreferenceDto = z.object({
  categoryId: z.string(),
  notifyNews: z.boolean().default(true),
  notifyEvents: z.boolean().default(true),
});

export const updateCategoryPreferenceDto = z.object({
  categoryId: z.string(),
  notifyNews: z.boolean().optional(),
  notifyEvents: z.boolean().optional(),
});

export const removeCategoryPreferenceDto = z.object({
  categoryId: z.string(),
});

export type AddCategoryPreferenceDto = z.infer<typeof addCategoryPreferenceDto>;
export type UpdateCategoryPreferenceDto = z.infer<typeof updateCategoryPreferenceDto>;
export type RemoveCategoryPreferenceDto = z.infer<typeof removeCategoryPreferenceDto>;

