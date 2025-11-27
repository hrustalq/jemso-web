import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type Prisma } from "../../../../../generated/prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission, hasPermission } from "~/server/api/rbac";
import { createEventDto } from "./dto/create-event.dto";
import { updateEventDto } from "./dto/update-event.dto";
import {
  getEventBySlugDto,
  listEventsDto,
} from "./dto/get-event.dto";

export const eventsRouter = createTRPCRouter({
  // Public: Get event by slug
  getBySlug: publicProcedure
    .input(getEventBySlugDto)
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          _count: {
            select: { registrations: true },
          },
        },
      });

      // Check if event is published or user has permission to view unpublished
      const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "event", "read")
        : false;

      if (!event || (!event.published && !canViewUnpublished)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // Increment views
      await ctx.db.event.update({
        where: { id: event.id },
        data: { views: { increment: 1 } },
      });

      return event;
    }),

  // Public: List events
  list: publicProcedure.input(listEventsDto).query(async ({ ctx, input }) => {
    const { page, pageSize, published, categoryId, authorId, search, upcoming, past } =
      input;
    const { skip, take } = calculatePagination(page, pageSize, 0);

    const now = new Date();
    
    const where: Prisma.EventWhereInput = {
      ...(published !== undefined ? { published } : { published: true }),
      ...(categoryId && { categoryId }),
      ...(authorId && { authorId }),
      ...(upcoming && { startDate: { gte: now } }),
      ...(past && { endDate: { lt: now } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { excerpt: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, items] = await ctx.db.$transaction([
      ctx.db.event.count({ where }),
      ctx.db.event.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: "desc" },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          _count: {
            select: { registrations: true },
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

  // Protected: Create event
  create: protectedProcedure
    .input(createEventDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "create");

      const { blocks, ...eventData } = input;

      // Check if slug already exists
      const existing = await ctx.db.event.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An event with this slug already exists",
        });
      }

      // Ensure content field has a value (use empty string if blocks are provided)
      const content = input.content ?? (blocks ? "" : "");

      return await ctx.db.event.create({
        data: {
          ...eventData,
          content,
          blocks: blocks ? (blocks as unknown as Prisma.InputJsonValue) : undefined,
          authorId: ctx.session.user.id,
          publishedAt: input.published ? new Date() : null,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          _count: {
            select: { registrations: true },
          },
        },
      });
    }),

  // Protected: Update event
  update: protectedProcedure
    .input(updateEventDto)
    .mutation(async ({ ctx, input }) => {
      const { id, blocks, ...updateData } = input;

      const event = await ctx.db.event.findUnique({
        where: { id },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // Check if user owns the event or has permission to update any event
      const canUpdateAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "event",
        "update",
      );

      if (event.authorId !== ctx.session.user.id && !canUpdateAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own events",
        });
      }

      return await ctx.db.event.update({
        where: { id },
        data: {
          ...updateData,
          ...(blocks !== undefined && { blocks: blocks as unknown as Prisma.InputJsonValue }),
          ...(updateData.published !== undefined &&
            updateData.published &&
            !event.publishedAt && { publishedAt: new Date() }),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          _count: {
            select: { registrations: true },
          },
        },
      });
    }),

  // Protected: Delete event
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // Check if user owns the event or has permission to delete any event
      const canDeleteAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "event",
        "delete",
      );

      if (event.authorId !== ctx.session.user.id && !canDeleteAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own events",
        });
      }

      await ctx.db.event.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Protected: Get event stats (admin only)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    await requirePermission(ctx.db, ctx.session.user.id, "event", "read");

    const now = new Date();

    const [total, published, upcoming, past, totalRegistrations] = await Promise.all([
      ctx.db.event.count(),
      ctx.db.event.count({ where: { published: true } }),
      ctx.db.event.count({ where: { startDate: { gte: now } } }),
      ctx.db.event.count({ where: { endDate: { lt: now } } }),
      ctx.db.eventRegistration.count(),
    ]);

    return {
      total,
      published,
      upcoming,
      past,
      totalRegistrations,
    };
  }),
});

