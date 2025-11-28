import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type Prisma } from "../../../../../generated/prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { requirePermission, hasPermission, getUserTier } from "~/server/api/rbac";
import { createBlogPostDto } from "./dto/create-post.dto";
import { updateBlogPostDto } from "./dto/update-post.dto";
import {
  getPostBySlugDto,
  listPostsDto,
} from "./dto/get-post.dto";

export const postsRouter = createTRPCRouter({
  // Public: Get post by slug
  getBySlug: publicProcedure
    .input(getPostBySlugDto)
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
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
          comments: {
            where: { approved: true },
            include: {
              author: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
      });

      // Check if post is published or user has permission to view unpublished
      const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "blog_post", "read")
        : false;

      if (!post || (!post.published && !canViewUnpublished)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Check minTier access
      if (post.minTier > 0) {
        const userTier = ctx.session?.user 
          ? await getUserTier(ctx.db, ctx.session.user.id) 
          : 0;
        
        if (userTier < post.minTier && !canViewUnpublished) {
           throw new TRPCError({
             code: "FORBIDDEN",
             message: "You need a higher subscription tier to view this post",
           });
        }
      }

      // Increment views
      await ctx.db.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });

      return post;
    }),

  // Public: List posts
  list: publicProcedure.input(listPostsDto).query(async ({ ctx, input }) => {
    const { page, pageSize, published, categoryId, tagId, authorId, search } =
      input;
    const { skip, take } = calculatePagination(page, pageSize, 0);

    // Get user tier for filtering
    const userTier = ctx.session?.user 
      ? await getUserTier(ctx.db, ctx.session.user.id) 
      : 0;
      
    const canViewUnpublished = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "blog_post", "read")
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
      ctx.db.blogPost.count({ where }),
      ctx.db.blogPost.findMany({
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
          _count: {
            select: { comments: true },
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

  // Protected: Create post
  create: protectedProcedure
    .input(createBlogPostDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "blog_post", "create");

      const { tagIds, blocks, htmlContent, ...postData } = input;

      // Check if slug already exists
      const existing = await ctx.db.blogPost.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this slug already exists",
        });
      }

      // Ensure content field has a value (use empty string if blocks/htmlContent are provided)
      const content = input.content ?? (blocks || htmlContent ? "" : "");

      return await ctx.db.blogPost.create({
        data: {
          ...postData,
          content,
          blocks: blocks ? (blocks as unknown as Prisma.InputJsonValue) : undefined,
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

  // Protected: Update post
  update: protectedProcedure
    .input(updateBlogPostDto)
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, blocks, htmlContent, ...updateData } = input;

      const post = await ctx.db.blogPost.findUnique({
        where: { id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Check if user owns the post or has permission to update any post
      const canUpdateAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "blog_post",
        "update",
      );

      if (post.authorId !== ctx.session.user.id && !canUpdateAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own posts",
        });
      }

      // Handle tags update
      if (tagIds) {
        await ctx.db.blogPostTag.deleteMany({
          where: { postId: id },
        });
      }

      return await ctx.db.blogPost.update({
        where: { id },
        data: {
          ...updateData,
          ...(blocks !== undefined && { blocks: blocks as unknown as Prisma.InputJsonValue }),
          ...(htmlContent !== undefined && { htmlContent }),
          ...(updateData.published !== undefined &&
            updateData.published &&
            !post.publishedAt && { publishedAt: new Date() }),
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

  // Protected: Delete post
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Check if user owns the post or has permission to delete any post
      const canDeleteAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "blog_post",
        "delete",
      );

      if (post.authorId !== ctx.session.user.id && !canDeleteAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own posts",
        });
      }

      await ctx.db.blogPost.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

