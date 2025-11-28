import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { paymentService } from "~/server/services/payment.service";
import {
  createCheckoutSessionDto,
  applyPromoCodeDto,
  completeCheckoutDto,
  validatePromoCodeDto,
} from "./dto/checkout.dto";
import { Decimal } from "decimal.js";
import { type db } from "~/server/db";

// Type for the database client
type DbClient = typeof db;

// Session expires in 30 minutes
const SESSION_EXPIRY_MINUTES = 30;

export const checkoutRouter = createTRPCRouter({
  // Get checkout session by plan slug (creates new or returns existing)
  getOrCreateSession: protectedProcedure
    .input(createCheckoutSessionDto)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get plan details
      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: { id: input.planId },
        include: {
          features: {
            include: {
              feature: true,
            },
          },
        },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "План не найден",
        });
      }

      if (!plan.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Этот план больше недоступен",
        });
      }

      // Check for existing active session for this user and plan
      const existingSession = await ctx.db.checkoutSession.findFirst({
        where: {
          userId,
          planId: plan.id,
          status: "pending",
          expiresAt: { gt: new Date() },
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
          promoCode: true,
        },
      });

      if (existingSession) {
        return {
          id: existingSession.id,
          plan: {
            ...existingSession.plan,
            price: Number(existingSession.plan.price),
            features: existingSession.plan.features,
          },
          promoCode: existingSession.promoCode ? {
            id: existingSession.promoCode.id,
            code: existingSession.promoCode.code,
            description: existingSession.promoCode.description,
            discountType: existingSession.promoCode.discountType as "percentage" | "fixed",
            discountValue: Number(existingSession.promoCode.discountValue),
            discountAmount: Number(existingSession.discountAmount),
            finalPrice: Number(existingSession.finalPrice),
            valid: true,
          } : null,
          originalPrice: Number(existingSession.originalPrice),
          discountAmount: Number(existingSession.discountAmount),
          finalPrice: Number(existingSession.finalPrice),
          currency: existingSession.currency,
          billing: existingSession.billingName ? {
            name: existingSession.billingName,
            email: existingSession.billingEmail ?? "",
            address: existingSession.billingAddress ?? undefined,
            city: existingSession.billingCity ?? undefined,
            country: existingSession.billingCountry ?? undefined,
            postalCode: existingSession.billingPostal ?? undefined,
          } : null,
          expiresAt: existingSession.expiresAt,
        };
      }

      // Create new session
      const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000);
      const planPrice = new Decimal(plan.price);
      let discountAmount = new Decimal(0);
      let finalPrice = planPrice;
      let promoCodeId: string | null = null;

      // Validate promo code if provided
      if (input.promoCode) {
        const promoResult = await validatePromoCode(ctx.db, input.promoCode, plan.id, planPrice.toNumber());
        if (promoResult.valid) {
          promoCodeId = promoResult.id;
          discountAmount = new Decimal(promoResult.discountAmount);
          finalPrice = planPrice.minus(discountAmount);
        }
      }

      const session = await ctx.db.checkoutSession.create({
        data: {
          userId,
          planId: plan.id,
          promoCodeId,
          originalPrice: planPrice,
          discountAmount,
          finalPrice,
          currency: plan.currency,
          status: "pending",
          expiresAt,
          billingEmail: ctx.session.user.email ?? undefined,
          billingName: ctx.session.user.name ?? undefined,
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
          promoCode: true,
        },
      });

      return {
        id: session.id,
        plan: {
          ...session.plan,
          price: Number(session.plan.price),
          features: session.plan.features,
        },
        promoCode: session.promoCode ? {
          id: session.promoCode.id,
          code: session.promoCode.code,
          description: session.promoCode.description,
          discountType: session.promoCode.discountType as "percentage" | "fixed",
          discountValue: Number(session.promoCode.discountValue),
          discountAmount: Number(session.discountAmount),
          finalPrice: Number(session.finalPrice),
          valid: true,
        } : null,
        originalPrice: Number(session.originalPrice),
        discountAmount: Number(session.discountAmount),
        finalPrice: Number(session.finalPrice),
        currency: session.currency,
        billing: session.billingName ? {
          name: session.billingName,
          email: session.billingEmail ?? "",
          address: session.billingAddress ?? undefined,
          city: session.billingCity ?? undefined,
          country: session.billingCountry ?? undefined,
          postalCode: session.billingPostal ?? undefined,
        } : null,
        expiresAt: session.expiresAt,
      };
    }),

  // Get existing checkout session
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.checkoutSession.findUnique({
        where: { id: input.sessionId },
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
          promoCode: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Сессия оформления не найдена",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет доступа к этой сессии",
        });
      }

      if (session.status !== "pending" || session.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Сессия оформления истекла",
        });
      }

      return {
        id: session.id,
        plan: {
          ...session.plan,
          price: Number(session.plan.price),
          features: session.plan.features,
        },
        promoCode: session.promoCode ? {
          id: session.promoCode.id,
          code: session.promoCode.code,
          description: session.promoCode.description,
          discountType: session.promoCode.discountType as "percentage" | "fixed",
          discountValue: Number(session.promoCode.discountValue),
          discountAmount: Number(session.discountAmount),
          finalPrice: Number(session.finalPrice),
          valid: true,
        } : null,
        originalPrice: Number(session.originalPrice),
        discountAmount: Number(session.discountAmount),
        finalPrice: Number(session.finalPrice),
        currency: session.currency,
        billing: session.billingName ? {
          name: session.billingName,
          email: session.billingEmail ?? "",
          address: session.billingAddress ?? undefined,
          city: session.billingCity ?? undefined,
          country: session.billingCountry ?? undefined,
          postalCode: session.billingPostal ?? undefined,
        } : null,
        expiresAt: session.expiresAt,
      };
    }),

  // Validate promo code
  validatePromoCode: protectedProcedure
    .input(validatePromoCodeDto)
    .query(async ({ ctx, input }) => {
      const plan = await ctx.db.subscriptionPlan.findUnique({
        where: { id: input.planId },
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "План не найден",
        });
      }

      const result = await validatePromoCode(ctx.db, input.code, plan.id, Number(plan.price));
      return result;
    }),

  // Apply promo code to session
  applyPromoCode: protectedProcedure
    .input(applyPromoCodeDto)
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.checkoutSession.findUnique({
        where: { id: input.sessionId },
        include: { plan: true },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Сессия оформления не найдена",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет доступа к этой сессии",
        });
      }

      if (session.status !== "pending" || session.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Сессия оформления истекла",
        });
      }

      const promoResult = await validatePromoCode(
        ctx.db,
        input.promoCode,
        session.planId,
        Number(session.originalPrice)
      );

      if (!promoResult.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: promoResult.message ?? "Промокод недействителен",
        });
      }

      const discountAmount = new Decimal(promoResult.discountAmount);
      const finalPrice = new Decimal(session.originalPrice).minus(discountAmount);

      await ctx.db.checkoutSession.update({
        where: { id: input.sessionId },
        data: {
          promoCodeId: promoResult.id,
          discountAmount,
          finalPrice,
        },
      });

      return {
        ...promoResult,
        finalPrice: finalPrice.toNumber(),
      };
    }),

  // Remove promo code from session
  removePromoCode: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.checkoutSession.findUnique({
        where: { id: input.sessionId },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Сессия оформления не найдена",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет доступа к этой сессии",
        });
      }

      await ctx.db.checkoutSession.update({
        where: { id: input.sessionId },
        data: {
          promoCodeId: null,
          discountAmount: 0,
          finalPrice: session.originalPrice,
        },
      });

      return { success: true };
    }),

  // Complete checkout
  complete: protectedProcedure
    .input(completeCheckoutDto)
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.checkoutSession.findUnique({
        where: { id: input.sessionId },
        include: {
          plan: true,
          promoCode: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Сессия оформления не найдена",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Нет доступа к этой сессии",
        });
      }

      if (session.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: session.status === "completed" 
            ? "Заказ уже оформлен" 
            : "Сессия оформления истекла",
        });
      }

      if (session.expiresAt < new Date()) {
        await ctx.db.checkoutSession.update({
          where: { id: session.id },
          data: { status: "expired" },
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Сессия оформления истекла",
        });
      }

      const finalPrice = Number(session.finalPrice);

      // Process payment if needed
      if (finalPrice > 0) {
        if (!input.paymentMethodId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Требуется способ оплаты",
          });
        }

        try {
          const metadata: Record<string, string> = {
            userId: session.userId,
            planId: session.planId,
            sessionId: session.id,
          };
          if (session.promoCodeId) {
            metadata.promoCodeId = session.promoCodeId;
          }
          
          await paymentService.processPayment({
            amount: finalPrice,
            currency: session.currency,
            paymentMethodId: input.paymentMethodId,
            description: `Подписка на план ${session.plan.name}`,
            metadata,
          });
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : "Ошибка оплаты",
          });
        }
      }

      // Cancel any existing active subscriptions
      await ctx.db.userSubscription.updateMany({
        where: {
          userId: session.userId,
          status: "active",
        },
        data: {
          status: "canceled",
          canceledAt: new Date(),
          cancelReason: "Replaced by new subscription",
        },
      });

      // Create subscription
      const startDate = new Date();
      const trialEndsAt = session.plan.trialDays > 0
        ? new Date(startDate.getTime() + session.plan.trialDays * 24 * 60 * 60 * 1000)
        : undefined;

      const subscription = await ctx.db.userSubscription.create({
        data: {
          userId: session.userId,
          planId: session.planId,
          startDate,
          trialEndsAt,
          status: session.plan.trialDays > 0 ? "trial" : "active",
          paymentMethod: input.paymentMethodId,
          promoCodeId: session.promoCodeId,
          discountAmount: session.discountAmount,
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

      // Increment promo code usage
      if (session.promoCodeId) {
        await ctx.db.promoCode.update({
          where: { id: session.promoCodeId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Mark session as completed
      await ctx.db.checkoutSession.update({
        where: { id: session.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          billingName: input.billing.name,
          billingEmail: input.billing.email,
          billingAddress: input.billing.address,
          billingCity: input.billing.city,
          billingCountry: input.billing.country,
          billingPostal: input.billing.postalCode,
        },
      });

      return {
        success: true,
        subscription: {
          ...subscription,
          plan: {
            ...subscription.plan,
            price: Number(subscription.plan.price),
          },
        },
      };
    }),
});

// Helper function to validate promo code
async function validatePromoCode(
  dbClient: DbClient,
  code: string,
  planId: string,
  planPrice: number
): Promise<{
  id: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  finalPrice: number;
  valid: boolean;
  message?: string;
}> {
  const promoCode = await dbClient.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promoCode) {
    return {
      id: "",
      code,
      description: null,
      discountType: "percentage",
      discountValue: 0,
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Промокод не найден",
    };
  }

  // Check if active
  if (!promoCode.isActive) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Промокод неактивен",
    };
  }

  // Check date range
  const now = new Date();
  if (promoCode.validFrom > now) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Промокод ещё не активен",
    };
  }

  if (promoCode.validUntil && promoCode.validUntil < now) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Срок действия промокода истёк",
    };
  }

  // Check usage limit
  if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Промокод исчерпан",
    };
  }

  // Check plan restriction
  if (promoCode.planIds.length > 0 && !promoCode.planIds.includes(planId)) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: "Промокод не применим к этому плану",
    };
  }

  // Check minimum purchase
  if (promoCode.minPurchase && planPrice < Number(promoCode.minPurchase)) {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType as "percentage" | "fixed",
      discountValue: Number(promoCode.discountValue),
      discountAmount: 0,
      finalPrice: planPrice,
      valid: false,
      message: `Минимальная сумма покупки: ${Number(promoCode.minPurchase)} ${promoCode.currency}`,
    };
  }

  // Calculate discount
  let discountAmount: number;
  const discountValue = Number(promoCode.discountValue);

  if (promoCode.discountType === "percentage") {
    discountAmount = (planPrice * discountValue) / 100;
    // Apply max discount cap if set
    if (promoCode.maxDiscount && discountAmount > Number(promoCode.maxDiscount)) {
      discountAmount = Number(promoCode.maxDiscount);
    }
  } else {
    discountAmount = discountValue;
  }

  // Ensure discount doesn't exceed price
  if (discountAmount > planPrice) {
    discountAmount = planPrice;
  }

  const finalPrice = planPrice - discountAmount;

  return {
    id: promoCode.id,
    code: promoCode.code,
    description: promoCode.description,
    discountType: promoCode.discountType as "percentage" | "fixed",
    discountValue,
    discountAmount,
    finalPrice,
    valid: true,
  };
}

