import { z } from "zod";

export const signInDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInDto = z.infer<typeof signInDto>;

export const signInOutputDto = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
  }),
  message: z.string(),
});

export type SignInOutputDto = z.infer<typeof signInOutputDto>;

