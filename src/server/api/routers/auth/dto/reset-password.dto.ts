import { z } from "zod";

export const resetPasswordDto = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;

export const resetPasswordOutputDto = z.object({
  message: z.string(),
});

export type ResetPasswordOutputDto = z.infer<typeof resetPasswordOutputDto>;

export const verifyResetTokenDto = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerifyResetTokenDto = z.infer<typeof verifyResetTokenDto>;

export const verifyResetTokenOutputDto = z.object({
  valid: z.boolean(),
  email: z.string().optional(),
});

export type VerifyResetTokenOutputDto = z.infer<typeof verifyResetTokenOutputDto>;

