import type { PrismaClient } from "../../../generated/prisma/client";
import { TRPCError } from "@trpc/server";

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
  db: PrismaClient,
  userId: string,
  resource: string,
  action: string,
): Promise<boolean> {
  const userWithRoles = await db.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithRoles) return false;

  // Check if user has the required permission through any of their roles
  for (const userRole of userWithRoles.userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      if (
        rolePermission.permission.resource === resource &&
        rolePermission.permission.action === action
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(
  db: PrismaClient,
  userId: string,
  roleSlug: string,
): Promise<boolean> {
  const userRole = await db.userRole.findFirst({
    where: {
      userId,
      role: {
        slug: roleSlug,
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  return !!userRole;
}

/**
 * Get all user permissions
 */
export async function getUserPermissions(
  db: PrismaClient,
  userId: string,
): Promise<Array<{ resource: string; action: string }>> {
  const userWithRoles = await db.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithRoles) return [];

  const permissions = new Map<string, { resource: string; action: string }>();

  for (const userRole of userWithRoles.userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      const key = `${rolePermission.permission.resource}:${rolePermission.permission.action}`;
      permissions.set(key, {
        resource: rolePermission.permission.resource,
        action: rolePermission.permission.action,
      });
    }
  }

  return Array.from(permissions.values());
}

/**
 * Require permission - throws TRPCError if user doesn't have permission
 */
export async function requirePermission(
  db: PrismaClient,
  userId: string,
  resource: string,
  action: string,
): Promise<void> {
  const hasAccess = await hasPermission(db, userId, resource, action);
  
  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to ${action} ${resource}`,
    });
  }
}

/**
 * Require role - throws TRPCError if user doesn't have role
 */
export async function requireRole(
  db: PrismaClient,
  userId: string,
  roleSlug: string,
): Promise<void> {
  const hasRoleAccess = await hasRole(db, userId, roleSlug);
  
  if (!hasRoleAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You must have the ${roleSlug} role to access this resource`,
    });
  }
}

/**
 * Check if user has access to a feature based on their subscription
 */
export async function hasFeatureAccess(
  db: PrismaClient,
  userId: string,
  featureSlug: string,
): Promise<{ hasAccess: boolean; value?: string }> {
  const subscription = await db.userSubscription.findFirst({
    where: {
      userId,
      status: "active",
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } },
      ],
    },
    include: {
      plan: {
        include: {
          features: {
            where: {
              feature: {
                slug: featureSlug,
              },
            },
            include: {
              feature: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!subscription) {
    return { hasAccess: false };
  }

  const planFeature = subscription.plan.features[0];
  
  if (!planFeature) {
    return { hasAccess: false };
  }

  return {
    hasAccess: true,
    value: planFeature.value ?? undefined,
  };
}

/**
 * Require feature access - throws TRPCError if user doesn't have access
 */
export async function requireFeatureAccess(
  db: PrismaClient,
  userId: string,
  featureSlug: string,
): Promise<string | undefined> {
  const { hasAccess, value } = await hasFeatureAccess(db, userId, featureSlug);
  
  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Your subscription plan doesn't include access to ${featureSlug}`,
    });
  }

  return value;
}

