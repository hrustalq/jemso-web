import { TRPCError } from "@trpc/server";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { requirePermission } from "~/server/api/rbac";
import {
  updateProfileDto,
  updateProfileOutputDto,
  type UpdateProfileOutputDto,
} from "./dto/update-profile.dto";
import {
  changePasswordDto,
  changePasswordOutputDto,
  type ChangePasswordOutputDto,
} from "./dto/change-password.dto";
import {
  updatePreferencesDto,
  userPreferencesOutputDto,
  type UserPreferencesOutputDto,
} from "./dto/preferences.dto";
import {
  addCategoryPreferenceDto,
  updateCategoryPreferenceDto,
  removeCategoryPreferenceDto,
} from "./dto/category-preferences.dto";
import { createUserDto } from "./dto/create-user.dto";
import { adminUpdateUserDto } from "./dto/admin-update-user.dto";

export const userRouter = createTRPCRouter({
  /**
   * Admin: Get user by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "user", "manage");

      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          userRoles: {
            include: { role: true },
          },
          subscriptions: {
            where: { status: "active" },
            include: { plan: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              blogPosts: true,
              comments: true,
            }
          }
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  /**
   * Admin: Create user
   */
  create: protectedProcedure
    .input(createUserDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "user", "manage");

      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await hash(input.password, 12);

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      // Assign roles
      if (input.roleIds && input.roleIds.length > 0) {
        await ctx.db.userRole.createMany({
          data: input.roleIds.map((roleId) => ({
            userId: user.id,
            roleId,
          })),
        });
      } else {
         // Assign default 'user' role if exists
         const userRole = await ctx.db.role.findUnique({ where: { slug: "user" } });
         if (userRole) {
            await ctx.db.userRole.create({
                data: {
                    userId: user.id,
                    roleId: userRole.id
                }
            });
         }
      }

      // Assign plan if provided
      if (input.planId) {
        const plan = await ctx.db.subscriptionPlan.findUnique({ where: { id: input.planId } });
        if (plan) {
            let endDate = null;
            if (plan.billingInterval === 'month') {
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (plan.billingInterval === 'year') {
                endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            await ctx.db.userSubscription.create({
                data: {
                    userId: user.id,
                    planId: input.planId,
                    status: "active",
                    startDate: new Date(),
                    endDate: endDate,
                }
            });
        }
      }

      return user;
    }),

  /**
   * Admin: Update user
   */
  update: protectedProcedure
    .input(adminUpdateUserDto)
    .mutation(async ({ ctx, input }) => {
      await requirePermission(ctx.db, ctx.session.user.id, "user", "manage");

      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const data: { name?: string; email?: string; password?: string } = {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
      };

      if (input.password) {
        data.password = await hash(input.password, 12);
      }

      await ctx.db.user.update({
        where: { id: input.id },
        data,
      });

      // Update roles if provided
      if (input.roleIds) {
        // Remove existing roles
        await ctx.db.userRole.deleteMany({
          where: { userId: input.id },
        });

        // Add new roles
        if (input.roleIds.length > 0) {
          await ctx.db.userRole.createMany({
            data: input.roleIds.map((roleId) => ({
              userId: input.id,
              roleId,
            })),
          });
        }
      }

      // Update plan if provided
      if (input.planId) {
          // Deactivate current active subscriptions
          await ctx.db.userSubscription.updateMany({
              where: { userId: input.id, status: "active" },
              data: { status: "canceled", canceledAt: new Date() }
          });

          const plan = await ctx.db.subscriptionPlan.findUnique({ where: { id: input.planId } });
          if (plan) {
            let endDate = null;
            if (plan.billingInterval === 'month') {
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (plan.billingInterval === 'year') {
                endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            // Create new subscription
            await ctx.db.userSubscription.create({
                data: {
                    userId: input.id,
                    planId: input.planId,
                    status: "active",
                    startDate: new Date(),
                    endDate: endDate,
                }
            });
          }
      }

      return { success: true };
    }),

  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        userRoles: {
          include: { role: true },
          where: {
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        },
        subscriptions: {
          where: {
            OR: [
              { status: "active" },
              { status: "trial" },
            ],
          },
          include: {
            plan: {
              include: {
                features: {
                  include: { feature: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      roles: user.userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        slug: ur.role.slug,
        expiresAt: ur.expiresAt,
      })),
      subscription: user.subscriptions[0]
        ? {
            id: user.subscriptions[0].id,
            status: user.subscriptions[0].status,
            planName: user.subscriptions[0].plan.name,
            planSlug: user.subscriptions[0].plan.slug,
            startDate: user.subscriptions[0].startDate,
            endDate: user.subscriptions[0].endDate,
            trialEndsAt: user.subscriptions[0].trialEndsAt,
            autoRenew: user.subscriptions[0].autoRenew,
            features: user.subscriptions[0].plan.features.map((pf) => ({
              name: pf.feature.name,
              slug: pf.feature.slug,
              type: pf.feature.featureType,
              value: pf.value,
            })),
          }
        : null,
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileDto)
    .output(updateProfileOutputDto)
    .mutation(async ({ ctx, input }): Promise<UpdateProfileOutputDto> => {
      // Check if email is being changed and if it's already taken
      if (input.email) {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser && existingUser.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email is already in use",
          });
        }
      }

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.image !== undefined && { image: input.image }),
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        updatedAt: user.updatedAt,
      };
    }),

  /**
   * Change password
   */
  changePassword: protectedProcedure
    .input(changePasswordDto)
    .output(changePasswordOutputDto)
    .mutation(async ({ ctx, input }): Promise<ChangePasswordOutputDto> => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Cannot change password for OAuth-only accounts. Please set a password first.",
        });
      }

      // Verify current password
      const isValidPassword = await compare(
        input.currentPassword,
        user.password
      );

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await hash(input.newPassword, 12);

      // Update password
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedPassword },
      });

      return {
        message: "Password changed successfully",
      };
    }),

  /**
   * Get user preferences
   */
  getPreferences: protectedProcedure
    .output(userPreferencesOutputDto)
    .query(async ({ ctx }): Promise<UserPreferencesOutputDto> => {
      // For now, return defaults. Later you can add a UserPreferences table
      // Check if user is subscribed to newsletter
      const newsletterSub = await ctx.db.newsletterSubscriber.findUnique({
        where: { email: ctx.session.user.email! },
      });

      return {
        emailNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        newsletterSubscribed: newsletterSub?.active ?? false,
      };
    }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(updatePreferencesDto)
    .output(userPreferencesOutputDto)
    .mutation(async ({ ctx, input }): Promise<UserPreferencesOutputDto> => {
      // Handle newsletter subscription
      if (input.newsletterSubscribed !== undefined) {
        const existingSub = await ctx.db.newsletterSubscriber.findUnique({
          where: { email: ctx.session.user.email! },
        });

        if (input.newsletterSubscribed && !existingSub) {
          // Subscribe
          await ctx.db.newsletterSubscriber.create({
            data: {
              email: ctx.session.user.email!,
              name: ctx.session.user.name,
              active: true,
              confirmedAt: new Date(),
            },
          });
        } else if (!input.newsletterSubscribed && existingSub) {
          // Unsubscribe
          await ctx.db.newsletterSubscriber.update({
            where: { email: ctx.session.user.email! },
            data: {
              active: false,
              unsubscribedAt: new Date(),
            },
          });
        }
      }

      // In a real app, store other preferences in a UserPreferences table
      // For now, just return the input
      const newsletterSub = await ctx.db.newsletterSubscriber.findUnique({
        where: { email: ctx.session.user.email! },
      });

      return {
        emailNotifications: input.emailNotifications ?? true,
        marketingEmails: input.marketingEmails ?? false,
        securityAlerts: input.securityAlerts ?? true,
        newsletterSubscribed: newsletterSub?.active ?? false,
      };
    }),

  /**
   * Delete account
   */
  deleteAccount: protectedProcedure
    .input(
      z.object({
        password: z.string().min(1, "Password is required for confirmation"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify password if account has one
      if (user.password) {
        const isValidPassword = await compare(input.password, user.password);

        if (!isValidPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Password is incorrect",
          });
        }
      }

      // Delete user (cascade will handle related records)
      await ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      });

      return {
        message: "Account deleted successfully",
      };
    }),

  /**
   * Get user's category preferences
   */
  getCategoryPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.userCategoryPreference.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
      },
    });
  }),

  /**
   * Add category preference
   */
  addCategoryPreference: protectedProcedure
    .input(addCategoryPreferenceDto)
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const category = await ctx.db.category.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if preference already exists
      const existing = await ctx.db.userCategoryPreference.findUnique({
        where: {
          userId_categoryId: {
            userId: ctx.session.user.id,
            categoryId: input.categoryId,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Category preference already exists",
        });
      }

      return await ctx.db.userCategoryPreference.create({
        data: {
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
          notifyNews: input.notifyNews,
          notifyEvents: input.notifyEvents,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true,
            },
          },
        },
      });
    }),

  /**
   * Update category preference
   */
  updateCategoryPreference: protectedProcedure
    .input(updateCategoryPreferenceDto)
    .mutation(async ({ ctx, input }) => {
      const preference = await ctx.db.userCategoryPreference.findUnique({
        where: {
          userId_categoryId: {
            userId: ctx.session.user.id,
            categoryId: input.categoryId,
          },
        },
      });

      if (!preference) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category preference not found",
        });
      }

      return await ctx.db.userCategoryPreference.update({
        where: {
          userId_categoryId: {
            userId: ctx.session.user.id,
            categoryId: input.categoryId,
          },
        },
        data: {
          ...(input.notifyNews !== undefined && { notifyNews: input.notifyNews }),
          ...(input.notifyEvents !== undefined && { notifyEvents: input.notifyEvents }),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true,
            },
          },
        },
      });
    }),

  /**
   * Remove category preference
   */
  removeCategoryPreference: protectedProcedure
    .input(removeCategoryPreferenceDto)
    .mutation(async ({ ctx, input }) => {
      const preference = await ctx.db.userCategoryPreference.findUnique({
        where: {
          userId_categoryId: {
            userId: ctx.session.user.id,
            categoryId: input.categoryId,
          },
        },
      });

      if (!preference) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category preference not found",
        });
      }

      await ctx.db.userCategoryPreference.delete({
        where: {
          userId_categoryId: {
            userId: ctx.session.user.id,
            categoryId: input.categoryId,
          },
        },
      });

      return { success: true };
    }),
});

