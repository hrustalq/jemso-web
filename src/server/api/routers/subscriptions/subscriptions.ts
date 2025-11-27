import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission, hasFeatureAccess } from "~/server/api/rbac";
import {
  createSubscriptionDto,
  updateSubscriptionDto,
  cancelSubscriptionDto,
  listSubscriptionsDto,
  checkFeatureDto,
} from "./dto/subscription.dto";

export const subscriptionsRouter = createTRPCRouter({
  // Get current user's active subscription
  myCurrent: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.userSubscription.findFirst({
      where: {
        userId: ctx.session.user.id,
        status: "active",
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } },
        ],
      },
      include: {
        plan: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscription;
  }),

  // List subscriptions (admin can see all, users see their own)
  list: protectedProcedure
    .input(listSubscriptionsDto)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, userId, planId, status } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      // Check if user is trying to see other users' subscriptions
      if (userId && userId !== ctx.session.user.id) {
        await requirePermission(ctx.db, ctx.session.user.id, "subscription", "read");
      }

      const where = {
        ...(userId ? { userId } : { userId: ctx.session.user.id }),
        ...(planId && { planId }),
        ...(status && { status }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.userSubscription.count({ where }),
        ctx.db.userSubscription.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            plan: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
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

  // Create subscription (admin or for self)
  create: protectedProcedure
    .input(createSubscriptionDto)
    .mutation(async ({ ctx, input }) => {
      // Check if creating for another user
      if (input.userId !== ctx.session.user.id) {
        await requirePermission(ctx.db, ctx.session.user.id, "subscription", "create");
      }

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

      // Check if plan exists
      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: { id: input.planId },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      if (!plan.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This plan is no longer available",
        });
      }

      // Cancel any existing active subscriptions
      await ctx.db.userSubscription.updateMany({
        where: {
          userId: input.userId,
          status: "active",
        },
        data: {
          status: "canceled",
          canceledAt: new Date(),
          cancelReason: "Replaced by new subscription",
        },
      });

      const startDate = input.startDate ?? new Date();
      const trialEndsAt = plan.trialDays > 0
        ? new Date(startDate.getTime() + plan.trialDays * 24 * 60 * 60 * 1000)
        : undefined;

      return await ctx.db.userSubscription.create({
        data: {
          ...input,
          startDate,
          trialEndsAt,
          status: plan.trialDays > 0 ? "trial" : "active",
        },
        include: {
          plan: {
            include: {
              features: {
                include: {
                  feature: true,
                },
              },
            },
          },
        },
      });
    }),

  // Update subscription
  update: protectedProcedure
    .input(updateSubscriptionDto)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const subscription = await ctx.db.userSubscription.findUnique({
        where: { id },
      });

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      // Check if user owns the subscription or is admin
      if (subscription.userId !== ctx.session.user.id) {
        await requirePermission(ctx.db, ctx.session.user.id, "subscription", "update");
      }

      return await ctx.db.userSubscription.update({
        where: { id },
        data: updateData,
        include: {
          plan: true,
        },
      });
    }),

  // Cancel subscription
  cancel: protectedProcedure
    .input(cancelSubscriptionDto)
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.db.userSubscription.findUnique({
        where: { id: input.id },
      });

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      // Check if user owns the subscription or is admin
      if (subscription.userId !== ctx.session.user.id) {
        await requirePermission(ctx.db, ctx.session.user.id, "subscription", "update");
      }

      if (subscription.status === "canceled" || subscription.status === "expired") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is already canceled or expired",
        });
      }

      return await ctx.db.userSubscription.update({
        where: { id: input.id },
        data: {
          status: "canceled",
          canceledAt: new Date(),
          cancelReason: input.reason,
          autoRenew: false,
        },
        include: {
          plan: true,
        },
      });
    }),

  // Check feature access
  checkFeature: protectedProcedure
    .input(checkFeatureDto)
    .query(async ({ ctx, input }) => {
      // Only allow checking own features unless admin
      if (input.userId !== ctx.session.user.id) {
        await requirePermission(ctx.db, ctx.session.user.id, "subscription", "read");
      }

      const { hasAccess, value } = await hasFeatureAccess(
        ctx.db,
        input.userId,
        input.featureSlug,
      );

      return { hasAccess, value };
    }),

  // Get my features
  myFeatures: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.userSubscription.findFirst({
      where: {
        userId: ctx.session.user.id,
        status: "active",
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } },
        ],
      },
      include: {
        plan: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return [];
    }

    return subscription.plan.features.map((pf) => ({
      ...pf.feature,
      value: pf.value,
    }));
  }),
});

