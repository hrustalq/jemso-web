import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { requirePermission } from "~/server/api/rbac";
import { createTagDto, updateTagDto } from "./dto/tag.dto";

export const tagsRouter = createTRPCRouter({
  // Public: Get all tags
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }),

  // Protected: Create tag (requires permission)
  create: protectedProcedure
    .input(createTagDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "tag", "create");

      const existing = await ctx.db.tag.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A tag with this slug already exists",
        });
      }

      return await ctx.db.tag.create({
        data: input,
      });
    }),

  // Protected: Update tag (requires permission)
  update: protectedProcedure
    .input(updateTagDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "tag", "update");

      const { id, ...updateData } = input;

      const tag = await ctx.db.tag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      return await ctx.db.tag.update({
        where: { id },
        data: updateData,
      });
    }),

  // Protected: Delete tag (requires permission)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "tag", "delete");

      const { id } = input;

      const tag = await ctx.db.tag.findUnique({
        where: { id },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      await ctx.db.tag.delete({
        where: { id },
      });

      return { success: true };
    }),
});

