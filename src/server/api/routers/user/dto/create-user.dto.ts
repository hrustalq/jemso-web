import { z } from "zod";

export const createUserDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  roleIds: z.array(z.string()).optional(),
  planId: z.string().optional(), // For setting initial subscription plan
});

export type CreateUserDto = z.infer<typeof createUserDto>;

