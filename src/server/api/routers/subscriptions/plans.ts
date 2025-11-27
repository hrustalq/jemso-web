import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission } from "~/server/api/rbac";
import {
  createPlanDto,
  updatePlanDto,
  getPlanDto,
  listPlansDto,
} from "./dto/plan.dto";

export const plansRouter = createTRPCRouter({
  // Public: List active plans
  list: publicProcedure
    .input(listPlansDto)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, isActive } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where = {
        ...(isActive !== undefined ? { isActive } : { isActive: true }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.subscriptionPlan.count({ where }),
        ctx.db.subscriptionPlan.findMany({
          where,
          skip,
          take,
          orderBy: { order: "asc" },
          include: {
            features: {
              include: {
                feature: true,
              },
            },
            _count: {
              select: { subscriptions: true },
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

  // Public: Get plan by ID or slug
  get: publicProcedure
    .input(getPlanDto)
    .query(async ({ ctx, input }) => {
      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: input.id ? { id: input.id } : { slug: input.slug },
        include: {
          features: {
            include: {
              feature: true,
            },
          },
          _count: {
            select: { subscriptions: true },
          },
        },
      });

      if (!plan || (!plan.isActive && !ctx.session)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      return plan;
    }),

  // Protected: Create plan (admin only)
  create: protectedProcedure
    .input(createPlanDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "subscription_plan", "create");

      const { featureIds, ...planData } = input;

      // Check if slug already exists
      const existing = await ctx.db.subscriptionPlan.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A plan with this slug already exists",
        });
      }

      return await ctx.db.subscriptionPlan.create({
        data: {
          ...planData,
          ...(featureIds &&
            featureIds.length > 0 && {
              features: {
                create: featureIds.map((f) => ({
                  featureId: f.featureId,
                  value: f.value,
                })),
              },
            }),
        },
        include: {
          features: {
            include: {
              feature: true,
            },
          },
        },
      });
    }),

  // Protected: Update plan (admin only)
  update: protectedProcedure
    .input(updatePlanDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "subscription_plan", "update");

      const { id, featureIds, ...updateData } = input;

      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: { id },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      // Handle features update
      if (featureIds) {
        await ctx.db.planFeature.deleteMany({
          where: { planId: id },
        });
      }

      return await ctx.db.subscriptionPlan.update({
        where: { id },
        data: {
          ...updateData,
          ...(featureIds && {
            features: {
              create: featureIds.map((f) => ({
                featureId: f.featureId,
                value: f.value,
              })),
            },
          }),
        },
        include: {
          features: {
            include: {
              feature: true,
            },
          },
        },
      });
    }),

  // Protected: Delete plan (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "subscription_plan", "delete");

      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { subscriptions: true },
          },
        },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      if (plan._count.subscriptions > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete plan with active subscriptions",
        });
      }

      await ctx.db.subscriptionPlan.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

