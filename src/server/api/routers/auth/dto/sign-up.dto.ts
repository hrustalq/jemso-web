import { z } from "zod";

export const signUpDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export type SignUpDto = z.infer<typeof signUpDto>;

export const signUpOutputDto = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

export type SignUpOutputDto = z.infer<typeof signUpOutputDto>;

