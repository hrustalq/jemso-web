import { z } from "zod";

export const adminUpdateUserDto = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional(), // Optional to reset password
  roleIds: z.array(z.string()).optional(), // Replace all roles
  planId: z.string().optional(), // Change/Set plan
});

export type AdminUpdateUserDto = z.infer<typeof adminUpdateUserDto>;

