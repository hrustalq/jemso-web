import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { 
  applyTranslations,
  type Translations,
} from "~/server/api/utils";
import { requirePermission } from "~/server/api/rbac";
import {
  createCategoryDto,
  updateCategoryDto,
  getCategoryDto,
  listCategoriesDto,
} from "./dto/category.dto";

export const categoriesRouter = createTRPCRouter({
  // Public: Get all categories
  list: publicProcedure.input(listCategoriesDto.optional()).query(async ({ ctx, input }) => {
    const where = {
      ...(input?.showInNav !== undefined && { showInNav: input.showInNav }),
      ...(input?.featured !== undefined && { featured: input.featured }),
    };

    const categories = await ctx.db.category.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { posts: true, events: true },
        },
      },
    });

    // Apply translations if locale is specified
    const locale = input?.locale;
    if (locale) {
      return categories.map((category) => {
        if (category.translations) {
          return applyTranslations(
            category,
            category.translations as Translations,
            locale,
            ["name", "description"]
          );
        }
        return category;
      });
    }

    return categories;
  }),

  // Public: Get navigation categories
  navigation: publicProcedure
    .input(z.object({ 
      locale: z.string().optional() 
    }).optional())
    .query(async ({ ctx, input }) => {
      const categories = await ctx.db.category.findMany({
        where: { showInNav: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          translations: true,
        },
      });

      // Apply translations if locale is specified
      const locale = input?.locale;
      if (locale) {
        return categories.map((category) => {
          if (category.translations) {
            return applyTranslations(
              category,
              category.translations as Translations,
              locale,
              ["name"]
            );
          }
          return category;
        });
      }

      return categories;
    }),

  // Public: Get category by slug or id
  get: publicProcedure
    .input(getCategoryDto)
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: input.id ? { id: input.id } : { slug: input.slug },
        include: {
          _count: {
            select: { posts: true, events: true },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Apply translations if locale is specified
      const locale = input.locale;
      if (locale && category.translations) {
        return applyTranslations(
          category,
          category.translations as Translations,
          locale,
          ["name", "description"]
        );
      }

      return category;
    }),

  // Protected: Create category (requires permission)
  create: protectedProcedure
    .input(createCategoryDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "category", "create");

      const existing = await ctx.db.category.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this slug already exists",
        });
      }

      return await ctx.db.category.create({
        data: input,
      });
    }),

  // Protected: Update category (requires permission)
  update: protectedProcedure
    .input(updateCategoryDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "category", "update");

      const { id, ...updateData } = input;

      const category = await ctx.db.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return await ctx.db.category.update({
        where: { id },
        data: updateData,
      });
    }),

  // Protected: Delete category (requires permission)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "category", "delete");

      const { id } = input;

      const category = await ctx.db.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { posts: true, events: true },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      if (category._count.posts > 0 || category._count.events > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot delete category with ${category._count.posts} post(s) and ${category._count.events} event(s)`,
        });
      }

      await ctx.db.category.delete({
        where: { id },
      });

      return { success: true };
    }),
});

