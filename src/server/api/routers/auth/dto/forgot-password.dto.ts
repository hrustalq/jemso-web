import { z } from "zod";

export const forgotPasswordDto = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;

export const forgotPasswordOutputDto = z.object({
  message: z.string(),
  email: z.string(),
});

export type ForgotPasswordOutputDto = z.infer<typeof forgotPasswordOutputDto>;

