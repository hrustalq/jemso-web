import { z } from "zod";

export const updateProfileDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileDto>;

export const updateProfileOutputDto = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  updatedAt: z.date(),
});

export type UpdateProfileOutputDto = z.infer<typeof updateProfileOutputDto>;

