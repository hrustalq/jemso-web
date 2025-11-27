import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createRoleDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const updateRoleDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const getRoleDto = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id || data.slug, {
  message: "Either id or slug must be provided",
});

export const listRolesDto = paginatedQuerySchema.extend({
  search: z.string().optional(),
});

export const assignRoleDto = z.object({
  userId: z.string(),
  roleId: z.string(),
  expiresAt: z.date().optional(),
});

export const removeRoleDto = z.object({
  userId: z.string(),
  roleId: z.string(),
});

export type CreateRoleDto = z.infer<typeof createRoleDto>;
export type UpdateRoleDto = z.infer<typeof updateRoleDto>;
export type GetRoleDto = z.infer<typeof getRoleDto>;
export type ListRolesDto = z.infer<typeof listRolesDto>;
export type AssignRoleDto = z.infer<typeof assignRoleDto>;
export type RemoveRoleDto = z.infer<typeof removeRoleDto>;

