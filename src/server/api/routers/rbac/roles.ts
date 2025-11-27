import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission } from "~/server/api/rbac";
import {
  createRoleDto,
  updateRoleDto,
  getRoleDto,
  listRolesDto,
  assignRoleDto,
  removeRoleDto,
} from "./dto/role.dto";

export const rolesRouter = createTRPCRouter({
  // List all roles
  list: protectedProcedure
    .input(listRolesDto)
    .query(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "role", "read");

      const { page, pageSize, search } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.role.count({ where }),
        ctx.db.role.findMany({
          where,
          skip,
          take,
          orderBy: { name: "asc" },
          include: {
            _count: {
              select: { userRoles: true, rolePermissions: true },
            },
          },
        }),
      ]);

      return {
        items,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page < Math.ceil(total / pageSize),
      };
    }),

  // Get role by ID or slug
  get: protectedProcedure
    .input(getRoleDto)
    .query(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "role", "read");

      const role = await ctx.db.role.findUnique({
        where: input.id ? { id: input.id } : { slug: input.slug },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
          _count: {
            select: { userRoles: true },
          },
        },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      return role;
    }),

  // Create role
  create: protectedProcedure
    .input(createRoleDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "role", "create");

      const { permissionIds, ...roleData } = input;

      // Check if slug already exists
      const existing = await ctx.db.role.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A role with this slug already exists",
        });
      }

      return await ctx.db.role.create({
        data: {
          ...roleData,
          ...(permissionIds &&
            permissionIds.length > 0 && {
              rolePermissions: {
                create: permissionIds.map((permissionId) => ({
                  permissionId,
                })),
              },
            }),
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    }),

  // Update role
  update: protectedProcedure
    .input(updateRoleDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "role", "update");

      const { id, permissionIds, ...updateData } = input;

      const role = await ctx.db.role.findUnique({
        where: { id },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      if (role.isSystem) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "System roles cannot be modified",
        });
      }

      // Handle permissions update
      if (permissionIds) {
        await ctx.db.rolePermission.deleteMany({
          where: { roleId: id },
        });
      }

      return await ctx.db.role.update({
        where: { id },
        data: {
          ...updateData,
          ...(permissionIds && {
            rolePermissions: {
              create: permissionIds.map((permissionId) => ({
                permissionId,
              })),
            },
          }),
        },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    }),

  // Delete role
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "role", "delete");

      const role = await ctx.db.role.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { userRoles: true },
          },
        },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      if (role.isSystem) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "System roles cannot be deleted",
        });
      }

      if (role._count.userRoles > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete role that is assigned to users",
        });
      }

      await ctx.db.role.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Assign role to user
  assignToUser: protectedProcedure
    .input(assignRoleDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "user_role", "create");

      // Check if user exists
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if role exists
      const role = await ctx.db.role.findUnique({
        where: { id: input.roleId },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      // Check if already assigned
      const existing = await ctx.db.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Role already assigned to user",
        });
      }

      return await ctx.db.userRole.create({
        data: input,
        include: {
          role: true,
        },
      });
    }),

  // Remove role from user
  removeFromUser: protectedProcedure
    .input(removeRoleDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "user_role", "delete");

      const userRole = await ctx.db.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
      });

      if (!userRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role assignment not found",
        });
      }

      await ctx.db.userRole.delete({
        where: {
          userId_roleId: {
            userId: input.userId,
            roleId: input.roleId,
          },
        },
      });

      return { success: true };
    }),
});

