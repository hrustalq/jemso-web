import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission } from "~/server/api/rbac";
import {
  subscribeNewsletterDto,
  subscribeToCategoryDto,
  unsubscribeNewsletterDto,
  confirmSubscriptionDto,
  listSubscribersDto,
} from "./dto/newsletter.dto";

export const newsletterRouter = createTRPCRouter({
  // Public: Subscribe to newsletter
  subscribe: publicProcedure
    .input(subscribeNewsletterDto)
    .mutation(async ({ ctx, input }) => {
      // Check if already subscribed
      const existing = await ctx.db.newsletterSubscriber.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        if (existing.active && existing.confirmedAt) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This email is already subscribed",
          });
        }

        // Reactivate subscription
        return await ctx.db.newsletterSubscriber.update({
          where: { email: input.email },
          data: {
            active: true,
            unsubscribedAt: null,
            name: input.name ?? existing.name,
          },
        });
      }

      return await ctx.db.newsletterSubscriber.create({
        data: input,
      });
    }),

  // Public: Subscribe to category-specific newsletter
  subscribeToCategory: publicProcedure
    .input(subscribeToCategoryDto)
    .mutation(async ({ ctx, input }) => {
      const { email, name, categoryId } = input;

      // Verify category exists
      const category = await ctx.db.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if already subscribed
      const existing = await ctx.db.newsletterSubscriber.findUnique({
        where: { email },
      });

      let subscriber;
      
      if (existing) {
        // Update existing subscriber
        subscriber = await ctx.db.newsletterSubscriber.update({
          where: { email },
          data: {
            active: true,
            unsubscribedAt: null,
            name: name ?? existing.name,
          },
        });
      } else {
        // Create new subscriber
        subscriber = await ctx.db.newsletterSubscriber.create({
          data: {
            email,
            name,
          },
        });
      }

      // Add category preference
      await ctx.db.newsletterCategoryPreference.upsert({
        where: {
          subscriberId_categoryId: {
            subscriberId: subscriber.id,
            categoryId,
          },
        },
        update: {},
        create: {
          subscriberId: subscriber.id,
          categoryId,
        },
      });

      return subscriber;
    }),

  // Public: Unsubscribe from newsletter
  unsubscribe: publicProcedure
    .input(unsubscribeNewsletterDto)
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.db.newsletterSubscriber.findUnique({
        where: { email: input.email },
      });

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      return await ctx.db.newsletterSubscriber.update({
        where: { email: input.email },
        data: {
          active: false,
          unsubscribedAt: new Date(),
        },
      });
    }),

  // Public: Confirm subscription
  confirm: publicProcedure
    .input(confirmSubscriptionDto)
    .mutation(async ({ ctx, input }) => {
      const subscriber = await ctx.db.newsletterSubscriber.findUnique({
        where: { id: input.id },
      });

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (subscriber.confirmedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription already confirmed",
        });
      }

      return await ctx.db.newsletterSubscriber.update({
        where: { id: input.id },
        data: {
          confirmedAt: new Date(),
          active: true,
        },
      });
    }),

  // Protected: List subscribers (requires permission)
  list: protectedProcedure
    .input(listSubscribersDto)
    .query(async ({ ctx, input }) => {
      await requirePermission(
        ctx.db,
        ctx.session.user.id,
        "newsletter",
        "read",
      );

      const { page, pageSize, active, confirmed } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where = {
        ...(active !== undefined && { active }),
        ...(confirmed !== undefined &&
          (confirmed
            ? { confirmedAt: { not: null } }
            : { confirmedAt: null })),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.newsletterSubscriber.count({ where }),
        ctx.db.newsletterSubscriber.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
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

  // Protected: Get subscriber count (requires permission)
  count: protectedProcedure.query(async ({ ctx }) => {
    await requirePermission(ctx.db, ctx.session.user.id, "newsletter", "read");

    const [total, active, confirmed] = await ctx.db.$transaction([
      ctx.db.newsletterSubscriber.count(),
      ctx.db.newsletterSubscriber.count({ where: { active: true } }),
      ctx.db.newsletterSubscriber.count({
        where: { confirmedAt: { not: null } },
      }),
    ]);

    return {
      total,
      active,
      confirmed,
    };
  }),
});

