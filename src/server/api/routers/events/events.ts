import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type Prisma } from "../../../../../generated/prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { 
  calculatePagination, 
  calculateDistance,
  applyTranslations,
  type Translations,
} from "~/server/api/utils";
import { requirePermission, hasPermission, getUserTier } from "~/server/api/rbac";
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
          venue: true,
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

      // Check minTier access
      if (event.minTier > 0) {
        const userTier = ctx.session?.user 
          ? await getUserTier(ctx.db, ctx.session.user.id) 
          : 0;
        
        if (userTier < event.minTier && !canViewUnpublished) {
           throw new TRPCError({
             code: "FORBIDDEN",
             message: "You need a higher subscription tier to view this event",
           });
        }
      }

      // Increment views
      await ctx.db.event.update({
        where: { id: event.id },
        data: { views: { increment: 1 } },
      });

      // Apply translations if locale is specified
      const locale = input.locale;
      if (locale && event.translations) {
        const translatedEvent = applyTranslations(
          event,
          event.translations as Translations,
          locale,
          ["title", "excerpt", "content", "htmlContent"]
        );
        return translatedEvent;
      }

      return event;
    }),

  // Public: List events
  list: publicProcedure.input(listEventsDto).query(async ({ ctx, input }) => {
    const { 
      page, 
      pageSize, 
      published, 
      categoryId, 
      authorId, 
      search, 
      upcoming, 
      past,
      locale,
      city,
      country,
      isOnline,
      latitude,
      longitude,
      maxDistance,
      sortByDistance,
      venueId,
    } = input;
    const { skip, take } = calculatePagination(page, pageSize, 0);

    const now = new Date();

    // Get user tier for filtering
    const userTier = ctx.session?.user 
      ? await getUserTier(ctx.db, ctx.session.user.id) 
      : 0;

    const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "event", "read")
        : false;

    // Filter by tier only for public/users without management permissions
    const tierFilter = !canViewUnpublished ? { minTier: { lte: userTier } } : {};
    
    const where: Prisma.EventWhereInput = {
      ...(published !== undefined ? { published } : { published: true }),
      ...(categoryId && { categoryId }),
      ...(authorId && { authorId }),
      ...tierFilter,
      ...(upcoming && { startDate: { gte: now } }),
      ...(past && { endDate: { lt: now } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { excerpt: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      // Location-based filters
      ...(city && { city: { equals: city, mode: "insensitive" as const } }),
      ...(country && { country }),
      ...(isOnline !== undefined && { isOnline }),
      ...(venueId && { venueId }),
    };

    // Determine sort order
    const orderBy: Prisma.EventOrderByWithRelationInput = { startDate: "desc" };
    
    // If sorting by distance, we need to fetch all matching events first
    // and then sort/paginate in memory (for distance-based sorting)
    const needsDistanceSort = sortByDistance && latitude !== undefined && longitude !== undefined;

    const [total, items] = await ctx.db.$transaction([
      ctx.db.event.count({ where }),
      ctx.db.event.findMany({
        where,
        // If distance sorting, fetch all items then paginate in memory
        ...(needsDistanceSort ? {} : { skip, take }),
        orderBy,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          venue: true,
          _count: {
            select: { registrations: true },
          },
        },
      }),
    ]);

    // Process items with distance calculation and filtering
    let processedItems = items.map((event) => {
      // Calculate distance if user location is provided
      let distance: number | null = null;
      if (latitude !== undefined && longitude !== undefined && event.latitude && event.longitude) {
        distance = calculateDistance(latitude, longitude, event.latitude, event.longitude);
      }
      
      // Apply translations if locale is specified
      let translatedEvent = event;
      if (locale && event.translations) {
        translatedEvent = applyTranslations(
          event,
          event.translations as Translations,
          locale,
          ["title", "excerpt", "content", "htmlContent"]
        );
      }
      
      return {
        ...translatedEvent,
        distance,
      };
    });

    // Filter by max distance if specified
    if (maxDistance !== undefined && latitude !== undefined && longitude !== undefined) {
      processedItems = processedItems.filter(
        (event) => event.distance === null || event.distance <= maxDistance
      );
    }

    // Sort by distance if requested
    if (needsDistanceSort) {
      processedItems.sort((a, b) => {
        // Events without coordinates go to the end
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
      
      // Apply pagination after distance sorting
      processedItems = processedItems.slice(skip, skip + take);
    }

    // Recalculate total if distance filtering was applied
    const finalTotal = maxDistance !== undefined ? processedItems.length : total;

    return {
      items: processedItems,
      page,
      pageSize,
      total: finalTotal,
      totalPages: Math.ceil(finalTotal / pageSize),
      hasMore: page < Math.ceil(finalTotal / pageSize),
    };
  }),

  // Protected: Create event
  create: protectedProcedure
    .input(createEventDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "event", "create");

      const { 
        blocks, 
        htmlContent, 
        translations,
        venueId,
        ...eventData 
      } = input;

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

      // Verify venue exists if provided
      if (venueId) {
        const venue = await ctx.db.venue.findUnique({ where: { id: venueId } });
        if (!venue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Venue not found",
          });
        }
      }

      // Ensure content field has a value (use empty string if blocks/htmlContent are provided)
      const content = input.content ?? (blocks || htmlContent ? "" : "");

      return await ctx.db.event.create({
        data: {
          ...eventData,
          content,
          blocks: blocks ? (blocks as unknown as Prisma.InputJsonValue) : undefined,
          htmlContent: htmlContent ?? undefined,
          translations: translations ? (translations as unknown as Prisma.InputJsonValue) : undefined,
          venueId: venueId ?? undefined,
          authorId: ctx.session.user.id,
          publishedAt: input.published ? new Date() : null,
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          venue: true,
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
      const { id, blocks, htmlContent, translations, venueId, ...updateData } = input;

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

      // Verify venue exists if provided (and not null)
      if (venueId !== undefined && venueId !== null) {
        const venue = await ctx.db.venue.findUnique({ where: { id: venueId } });
        if (!venue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Venue not found",
          });
        }
      }

      return await ctx.db.event.update({
        where: { id },
        data: {
          ...updateData,
          ...(blocks !== undefined && { blocks: blocks as unknown as Prisma.InputJsonValue }),
          ...(htmlContent !== undefined && { htmlContent }),
          ...(translations !== undefined && { translations: translations as unknown as Prisma.InputJsonValue }),
          ...(venueId !== undefined && { venueId }),
          ...(updateData.published !== undefined &&
            updateData.published &&
            !event.publishedAt && { publishedAt: new Date() }),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          venue: true,
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

