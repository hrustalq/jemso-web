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
import { requirePermission } from "~/server/api/rbac";
import {
  createVenueDto,
  updateVenueDto,
  getVenueDto,
  listVenuesDto,
} from "./dto/venue.dto";

export const venuesRouter = createTRPCRouter({
  // Public: Get venue by id or slug
  get: publicProcedure
    .input(getVenueDto)
    .query(async ({ ctx, input }) => {
      const venue = await ctx.db.venue.findUnique({
        where: input.id ? { id: input.id } : { slug: input.slug },
        include: {
          _count: {
            select: { events: true },
          },
        },
      });

      if (!venue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Venue not found",
        });
      }

      // Apply translations if locale is specified
      if (input.locale && venue.translations) {
        return applyTranslations(
          venue,
          venue.translations as Translations,
          input.locale,
          ["name", "description", "address"]
        );
      }

      return venue;
    }),

  // Public: List venues
  list: publicProcedure
    .input(listVenuesDto)
    .query(async ({ ctx, input }) => {
      const {
        page,
        pageSize,
        city,
        country,
        search,
        isActive,
        locale,
        latitude,
        longitude,
        maxDistance,
        sortByDistance,
      } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      const where: Prisma.VenueWhereInput = {
        ...(isActive !== undefined ? { isActive } : { isActive: true }),
        ...(city && { city: { equals: city, mode: "insensitive" as const } }),
        ...(country && { country }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { address: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const needsDistanceSort = sortByDistance && latitude !== undefined && longitude !== undefined;

      const [total, items] = await ctx.db.$transaction([
        ctx.db.venue.count({ where }),
        ctx.db.venue.findMany({
          where,
          ...(needsDistanceSort ? {} : { skip, take }),
          orderBy: { name: "asc" },
          include: {
            _count: {
              select: { events: true },
            },
          },
        }),
      ]);

      // Process items with distance calculation
      let processedItems = items.map((venue) => {
        let distance: number | null = null;
        if (latitude !== undefined && longitude !== undefined) {
          distance = calculateDistance(latitude, longitude, venue.latitude, venue.longitude);
        }

        // Apply translations
        let translatedVenue = venue;
        if (locale && venue.translations) {
          translatedVenue = applyTranslations(
            venue,
            venue.translations as Translations,
            locale,
            ["name", "description", "address"]
          );
        }

        return {
          ...translatedVenue,
          distance,
        };
      });

      // Filter by max distance
      if (maxDistance !== undefined && latitude !== undefined && longitude !== undefined) {
        processedItems = processedItems.filter(
          (venue) => venue.distance !== null && venue.distance <= maxDistance
        );
      }

      // Sort by distance
      if (needsDistanceSort) {
        processedItems.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0;
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
        processedItems = processedItems.slice(skip, skip + take);
      }

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

  // Protected: Create venue
  create: protectedProcedure
    .input(createVenueDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "venue", "create");

      const { translations, images, amenities, ...venueData } = input;

      // Check if slug already exists
      const existing = await ctx.db.venue.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A venue with this slug already exists",
        });
      }

      return await ctx.db.venue.create({
        data: {
          ...venueData,
          translations: translations ? (translations as unknown as Prisma.InputJsonValue) : undefined,
          images: images ? (images as unknown as Prisma.InputJsonValue) : undefined,
          amenities: amenities ? (amenities as unknown as Prisma.InputJsonValue) : undefined,
        },
        include: {
          _count: {
            select: { events: true },
          },
        },
      });
    }),

  // Protected: Update venue
  update: protectedProcedure
    .input(updateVenueDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "venue", "update");

      const { id, translations, images, amenities, ...updateData } = input;

      const venue = await ctx.db.venue.findUnique({ where: { id } });

      if (!venue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Venue not found",
        });
      }

      // Check slug uniqueness if being changed
      if (updateData.slug && updateData.slug !== venue.slug) {
        const existing = await ctx.db.venue.findUnique({
          where: { slug: updateData.slug },
        });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A venue with this slug already exists",
          });
        }
      }

      return await ctx.db.venue.update({
        where: { id },
        data: {
          ...updateData,
          ...(translations !== undefined && { translations: translations as unknown as Prisma.InputJsonValue }),
          ...(images !== undefined && { images: images as unknown as Prisma.InputJsonValue }),
          ...(amenities !== undefined && { amenities: amenities as unknown as Prisma.InputJsonValue }),
        },
        include: {
          _count: {
            select: { events: true },
          },
        },
      });
    }),

  // Protected: Delete venue
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "venue", "delete");

      const venue = await ctx.db.venue.findUnique({
        where: { id: input.id },
        include: { _count: { select: { events: true } } },
      });

      if (!venue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Venue not found",
        });
      }

      // Check if venue is in use
      if (venue._count.events > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot delete venue that has associated events",
        });
      }

      await ctx.db.venue.delete({ where: { id: input.id } });

      return { success: true };
    }),

  // Public: Get venue stats (for admin)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    await requirePermission(ctx.db, ctx.session.user.id, "venue", "read");

    const [total, active, withEvents] = await Promise.all([
      ctx.db.venue.count(),
      ctx.db.venue.count({ where: { isActive: true } }),
      ctx.db.venue.count({
        where: {
          events: { some: {} },
        },
      }),
    ]);

    return {
      total,
      active,
      withEvents,
    };
  }),
});

