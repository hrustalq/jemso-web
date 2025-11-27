import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculatePagination } from "~/server/api/utils";
import { hasPermission, requirePermission } from "~/server/api/rbac";
import {
  createCommentDto,
  updateCommentDto,
  approveCommentDto,
  deleteCommentDto,
  listCommentsDto,
} from "./dto/comment.dto";

export const commentsRouter = createTRPCRouter({
  // Public: List comments
  list: publicProcedure
    .input(listCommentsDto)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, postId, approved, authorId } = input;
      const { skip, take } = calculatePagination(page, pageSize, 0);

      // Check if user has permission to view unapproved comments
      const canViewUnapproved = ctx.session?.user
        ? await hasPermission(ctx.db, ctx.session.user.id, "comment", "read")
        : false;

      const where = {
        ...(postId && { postId }),
        ...(approved !== undefined
          ? { approved }
          : !canViewUnapproved
            ? { approved: true }
            : {}),
        ...(authorId && { authorId }),
      };

      const [total, items] = await ctx.db.$transaction([
        ctx.db.comment.count({ where }),
        ctx.db.comment.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
            replies: {
              include: {
                author: {
                  select: { id: true, name: true, image: true },
                },
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

  // Protected: Create comment
  create: protectedProcedure
    .input(createCommentDto)
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.postId },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Check if parent comment exists
      if (input.parentId) {
        const parentComment = await ctx.db.comment.findUnique({
          where: { id: input.parentId },
        });

        if (!parentComment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent comment not found",
          });
        }
      }

      return await ctx.db.comment.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
          approved: false, // Requires moderation
        },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      });
    }),

  // Protected: Update comment
  update: protectedProcedure
    .input(updateCommentDto)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const comment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      // Check if user owns the comment or has permission to update any comment
      const canUpdateAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "comment",
        "update",
      );

      if (comment.authorId !== ctx.session.user.id && !canUpdateAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own comments",
        });
      }

      return await ctx.db.comment.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      });
    }),

  // Protected: Approve/reject comment (requires permission)
  approve: protectedProcedure
    .input(approveCommentDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(
        ctx.db,
        ctx.session.user.id,
        "comment",
        "approve",
      );

      const { id, approved } = input;

      const comment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      return await ctx.db.comment.update({
        where: { id },
        data: { approved },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      });
    }),

  // Protected: Delete comment
  delete: protectedProcedure
    .input(deleteCommentDto)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const comment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      // Check if user owns the comment or has permission to delete any comment
      const canDeleteAny = await hasPermission(
        ctx.db,
        ctx.session.user.id,
        "comment",
        "delete",
      );

      if (comment.authorId !== ctx.session.user.id && !canDeleteAny) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own comments",
        });
      }

      await ctx.db.comment.delete({
        where: { id },
      });

      return { success: true };
    }),
});

