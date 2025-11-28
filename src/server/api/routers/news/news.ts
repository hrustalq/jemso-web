import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission, hasPermission, getUserTier } from "~/server/api/rbac";
import { createNewsDto } from "./dto/create-news.dto";
import { updateNewsDto } from "./dto/update-news.dto";
import {
  getNewsBySlugDto,
  listNewsDto,
} from "./dto/get-news.dto";

export const newsRouter = createTRPCRouter({
  // Public: Get news by slug
  getBySlug: publicProcedure
    .input(getNewsBySlugDto)
    .query(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Check if news is published or user has permission to view unpublished
      const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "news", "read")
        : false;

      if (!news || (!news.published && !canViewUnpublished)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News article not found",
        });
      }

      // Check minTier access
      if (news.minTier > 0) {
        const userTier = ctx.session?.user 
          ? await getUserTier(ctx.db, ctx.session.user.id) 
          : 0;
        
        if (userTier < news.minTier && !canViewUnpublished) {
           throw new TRPCError({
             code: "FORBIDDEN",
             message: "You need a higher subscription tier to view this article",
           });
        }
      }

      // Increment views
      await ctx.db.news.update({
        where: { id: news.id },
        data: { views: { increment: 1 } },
      });

      return news;
    }),

  // Public: List news
  list: publicProcedure.input(listNewsDto).query(async ({ ctx, input }) => {
    const { page, pageSize, published, categoryId, tagId, authorId, search } =
      input;
    const { skip, take } = calculatePagination(page, pageSize, 0);

    // Get user tier for filtering
    const userTier = ctx.session?.user 
      ? await getUserTier(ctx.db, ctx.session.user.id) 
      : 0;
      
    // Check if user is admin/manager/editor to bypass tier filtering
    const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "news", "read")
        : false;

    // Filter by tier only for public/users without management permissions
    const tierFilter = !canViewUnpublished ? { minTier: { lte: userTier } } : {};

    const where = {
      ...(published !== undefined ? { published } : { published: true }),
      ...(categoryId && { categoryId }),
      ...(authorId && { authorId }),
      ...tierFilter,
      ...(tagId && {
        tags: {
          some: {
            tagId,
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { excerpt: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, items] = await ctx.db.$transaction([
      ctx.db.news.count({ where }),
      ctx.db.news.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          tags: {
            include: {
              tag: true,
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

  // Protected: Create news
  create: protectedProcedure
    .input(createNewsDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "news", "create");

      const { tagIds, htmlContent, content, ...newsData } = input;

      const existing = await ctx.db.news.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A news article with this slug already exists",
        });
      }

      const finalContent = content ?? (htmlContent ? "" : "");

      return await ctx.db.news.create({
        data: {
          ...newsData,
          content: finalContent,
          htmlContent: htmlContent ?? undefined,
          authorId: ctx.session.user.id,
          publishedAt: input.published ? new Date() : null,
          ...(tagIds &&
            tagIds.length > 0 && {
              tags: {
                create: tagIds.map((tagId) => ({
                  tagId,
                })),
              },
            }),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),

  // Protected: Update news
  update: protectedProcedure
    .input(updateNewsDto)
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, htmlContent, content, minTier, ...updateData } = input;

      const news = await ctx.db.news.findUnique({
        where: { id },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News article not found",
        });
      }

      const canUpdateAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "news",
        "update",
      );

      if (news.authorId !== ctx.session.user.id && !canUpdateAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own news articles",
        });
      }

      if (tagIds) {
        await ctx.db.newsTag.deleteMany({
          where: { newsId: id },
        });
      }

      return await ctx.db.news.update({
        where: { id },
        data: {
          ...updateData,
          ...(minTier !== undefined && { minTier }),
          ...(content !== undefined && { content }),
          ...(htmlContent !== undefined && { htmlContent }),
          ...(updateData.published !== undefined &&
            updateData.published &&
            !news.publishedAt && { publishedAt: new Date() }),
          ...(tagIds && {
            tags: {
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            },
          }),
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),

  // Protected: Delete news
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.db.news.findUnique({
        where: { id: input.id },
      });

      if (!news) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News article not found",
        });
      }

      const canDeleteAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "news",
        "delete",
      );

      if (news.authorId !== ctx.session.user.id && !canDeleteAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own news articles",
        });
      }

      await ctx.db.news.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

