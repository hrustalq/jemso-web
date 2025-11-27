import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { requirePermission } from "~/server/api/rbac";
import { createFeatureDto, updateFeatureDto } from "./dto/feature.dto";

export const featuresRouter = createTRPCRouter({
  // Public: List all features
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.feature.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { planFeatures: true },
        },
      },
    });
  }),

  // Protected: Create feature (admin only)
  create: protectedProcedure
    .input(createFeatureDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "feature", "create");

      // Check if slug already exists
      const existing = await ctx.db.feature.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A feature with this slug already exists",
        });
      }

      return await ctx.db.feature.create({
        data: input,
      });
    }),

  // Protected: Update feature (admin only)
  update: protectedProcedure
    .input(updateFeatureDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "feature", "update");

      const { id, ...updateData } = input;

      const feature = await ctx.db.feature.findUnique({
        where: { id },
      });

      if (!feature) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature not found",
        });
      }

      return await ctx.db.feature.update({
        where: { id },
        data: updateData,
      });
    }),

  // Protected: Delete feature (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "feature", "delete");

      const feature = await ctx.db.feature.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { planFeatures: true },
          },
        },
      });

      if (!feature) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature not found",
        });
      }

      if (feature._count.planFeatures > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete feature that is used in plans",
        });
      }

      await ctx.db.feature.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

