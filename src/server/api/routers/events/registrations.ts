import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Decimal } from "decimal.js";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission } from "~/server/api/rbac";
import {
  createRegistrationDto,
  updateRegistrationDto,
  cancelRegistrationDto,
  listRegistrationsDto,
  confirmPaymentDto,
} from "./dto/registration.dto";

export const registrationsRouter = createTRPCRouter({
  // List registrations
  list: protectedProcedure
    .input(listRegistrationsDto)
    .query(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "read");

      const { page, pageSize, eventId, userId, status, paymentStatus } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where = {
        ...(eventId && { eventId }),
        ...(userId && { userId }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.eventRegistration.count({ where }),
        ctx.db.eventRegistration.findMany({
          where,
          skip,
          take,
          orderBy: { registeredAt: "desc" },
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
                price: true,
                currency: true,
              },
            },
            user: {
              select: { id: true, name: true, email: true, image: true },
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

  // Get my registrations
  myRegistrations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.eventRegistration.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { registeredAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            endDate: true,
            location: true,
            price: true,
            currency: true,
          },
        },
      },
    });
  }),

  // Get registration by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const registration = await ctx.db.eventRegistration.findUnique({
        where: { id: input.id },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      if (!registration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Registration not found",
        });
      }

      // Check if user owns the registration or has permission
      const canViewAny = await requirePermission(
        ctx.db,
        ctx.session.user.id,
        "event",
        "read",
      ).catch(() => false);

      if (registration.userId !== ctx.session.user.id && !canViewAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own registrations",
        });
      }

      return registration;
    }),

  // Create registration
  create: protectedProcedure
    .input(createRegistrationDto)
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (!event.published) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot register for unpublished events",
        });
      }

      // Check if event has reached max participants
      if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event has reached maximum participants",
        });
      }

      // Check if user already registered
      const existing = await ctx.db.eventRegistration.findUnique({
        where: {
          eventId_userId: {
            eventId: input.eventId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already registered for this event",
        });
      }

      // Create registration
      const registration = await ctx.db.eventRegistration.create({
        data: {
          eventId: input.eventId,
          userId: ctx.session.user.id,
          paymentMethod: input.paymentMethod,
          paymentStatus: event.price.equals(0) ? "paid" : "pending",
          status: event.price.equals(0) ? "confirmed" : "pending",
          confirmedAt: event.price.equals(0) ? new Date() : null,
        },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      return registration;
    }),

  // Update registration (admin only)
  update: protectedProcedure
    .input(updateRegistrationDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "update");

      const { id, ...updateData } = input;

      const registration = await ctx.db.eventRegistration.findUnique({
        where: { id },
      });

      if (!registration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Registration not found",
        });
      }

      return await ctx.db.eventRegistration.update({
        where: { id },
        data: updateData,
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
    }),

  // Confirm payment (admin only)
  confirmPayment: protectedProcedure
    .input(confirmPaymentDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "update");

      const registration = await ctx.db.eventRegistration.findUnique({
        where: { id: input.id },
      });

      if (!registration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Registration not found",
        });
      }

      return await ctx.db.eventRegistration.update({
        where: { id: input.id },
        data: {
          paymentStatus: "paid",
          paidAmount: new Decimal(input.paidAmount),
          paymentMethod: input.paymentMethod,
          status: "confirmed",
          confirmedAt: new Date(),
        },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
    }),

  // Cancel registration
  cancel: protectedProcedure
    .input(cancelRegistrationDto)
    .mutation(async ({ ctx, input }) => {
      const registration = await ctx.db.eventRegistration.findUnique({
        where: { id: input.id },
      });

      if (!registration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Registration not found",
        });
      }

      // Check if user owns the registration or has permission
      const canCancelAny = await requirePermission(
        ctx.db,
        ctx.session.user.id,
        "event",
        "update",
      ).catch(() => false);

      if (registration.userId !== ctx.session.user.id && !canCancelAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own registrations",
        });
      }

      if (registration.status === "canceled") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Registration is already canceled",
        });
      }

      return await ctx.db.eventRegistration.update({
        where: { id: input.id },
        data: {
          status: "canceled",
          canceledAt: new Date(),
          cancelReason: input.reason,
        },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
    }),

  // Delete registration (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "delete");

      const registration = await ctx.db.eventRegistration.findUnique({
        where: { id: input.id },
      });

      if (!registration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Registration not found",
        });
      }

      await ctx.db.eventRegistration.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

