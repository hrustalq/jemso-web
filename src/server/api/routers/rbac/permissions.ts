import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission, hasPermission } from "~/server/api/rbac";
import {
  createPermissionDto,
  updatePermissionDto,
  listPermissionsDto,
  checkPermissionDto,
} from "./dto/permission.dto";

export const permissionsRouter = createTRPCRouter({
  // List all permissions
  list: protectedProcedure
    .input(listPermissionsDto)
    .query(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "permission", "read");

      const { page, pageSize, resource, search } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where = {
        ...(resource && { resource }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { resource: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.permission.count({ where }),
        ctx.db.permission.findMany({
          where,
          skip,
          take,
          orderBy: [{ resource: "asc" }, { action: "asc" }],
          include: {
            _count: {
              select: { rolePermissions: true },
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

  // Create permission
  create: protectedProcedure
    .input(createPermissionDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "permission", "create");

      // Check if slug already exists
      const existing = await ctx.db.permission.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A permission with this slug already exists",
        });
      }

      // Check if resource-action combination already exists
      const existingCombo = await ctx.db.permission.findUnique({
        where: {
          resource_action: {
            resource: input.resource,
            action: input.action,
          },
        },
      });

      if (existingCombo) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A permission for this resource-action combination already exists",
        });
      }

      return await ctx.db.permission.create({
        data: input,
      });
    }),

  // Update permission
  update: protectedProcedure
    .input(updatePermissionDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "permission", "update");

      const { id, ...updateData } = input;

      const permission = await ctx.db.permission.findUnique({
        where: { id },
      });

      if (!permission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Permission not found",
        });
      }

      return await ctx.db.permission.update({
        where: { id },
        data: updateData,
      });
    }),

  // Delete permission
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "permission", "delete");

      const permission = await ctx.db.permission.findUnique({
        where: { id: input.id },
      });

      if (!permission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Permission not found",
        });
      }

      await ctx.db.permission.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Check if user has specific permission
  check: publicProcedure
    .input(checkPermissionDto)
    .query(async ({ ctx, input }) => {
      const hasAccess = await hasPermission(
        ctx.db,
        input.userId,
        input.resource,
        input.action,
      );

      return { hasPermission: hasAccess };
    }),

  // Get current user's permissions
  myPermissions: protectedProcedure.query(async ({ ctx }) => {
    const userWithRoles = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        userRoles: {
          where: {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithRoles) {
      return [];
    }

    const permissions = new Set<string>();
    const permissionsList: Array<{
      id: string;
      name: string;
      slug: string;
      resource: string;
      action: string;
    }> = [];

    for (const userRole of userWithRoles.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        const key = rolePermission.permission.id;
        if (!permissions.has(key)) {
          permissions.add(key);
          permissionsList.push(rolePermission.permission);
        }
      }
    }

    return permissionsList;
  }),
});

