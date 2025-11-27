import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createPermissionDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  resource: z.string().min(1).max(100),
  action: z.string().min(1).max(50),
});

export const updatePermissionDto = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional(),
  resource: z.string().min(1).max(100).optional(),
  action: z.string().min(1).max(50).optional(),
});

export const listPermissionsDto = paginatedQuerySchema.extend({
  resource: z.string().optional(),
  search: z.string().optional(),
});

export const checkPermissionDto = z.object({
  userId: z.string(),
  resource: z.string(),
  action: z.string(),
});

export type CreatePermissionDto = z.infer<typeof createPermissionDto>;
export type UpdatePermissionDto = z.infer<typeof updatePermissionDto>;
export type ListPermissionsDto = z.infer<typeof listPermissionsDto>;
export type CheckPermissionDto = z.infer<typeof checkPermissionDto>;

