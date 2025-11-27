import { z } from "zod";

export const changePasswordDto = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type ChangePasswordDto = z.infer<typeof changePasswordDto>;

export const changePasswordOutputDto = z.object({
  message: z.string(),
});

export type ChangePasswordOutputDto = z.infer<typeof changePasswordOutputDto>;

