# RBAC & Subscription System Documentation

## Overview

This application implements a comprehensive **Role-Based Access Control (RBAC)** system with **dynamic roles and permissions**, along with a **flexible subscription system** for managing user access levels.

## Table of Contents

1. [RBAC System](#rbac-system)
2. [Subscription System](#subscription-system)
3. [API Usage](#api-usage)
4. [Helper Functions](#helper-functions)
5. [Database Schema](#database-schema)
6. [Seeded Data](#seeded-data)

---

## RBAC System

### Concepts

#### Roles
- **Dynamic**: Roles can be created, updated, and deleted through the API
- **System Roles**: Marked with `isSystem: true`, cannot be deleted (admin, author, moderator, user)
- **Expirable**: Role assignments can have an expiration date

#### Permissions
- **Resource-Action Based**: Each permission targets a specific `resource` and `action`
- **Example**: `blog_post:create`, `user:manage`
- **Dynamic**: New permissions can be created as needed

#### Role-Permission Mapping
- Many-to-many relationship
- A role can have multiple permissions
- A permission can belong to multiple roles

#### User-Role Mapping
- Many-to-many relationship
- A user can have multiple roles
- Roles can expire for specific users

### Default Roles

#### Admin
- **Slug**: `admin`
- **Permissions**: All permissions
- **System Role**: Yes
- **Purpose**: Full system access

#### Author
- **Slug**: `author`
- **Permissions**: 
  - `blog_post:create`
  - `blog_post:read`
  - `blog_post:update`
  - `blog_post:delete`
- **System Role**: Yes
- **Purpose**: Content creation and management

#### Moderator
- **Slug**: `moderator`
- **Permissions**:
  - `blog_post:read`
  - `comment:approve`
  - `comment:delete`
- **System Role**: Yes
- **Purpose**: Content moderation

#### User
- **Slug**: `user`
- **Permissions**:
  - `blog_post:read`
- **System Role**: Yes
- **Purpose**: Basic user access

---

## Subscription System

### Concepts

#### Subscription Plans
- **Dynamic**: Plans can be created and configured through the API
- **Features**: Each plan includes a set of features
- **Billing**: Supports monthly, yearly, and lifetime billing
- **Trial Period**: Optional trial days

#### Features
- **Types**:
  - `boolean`: Feature is enabled/disabled
  - `numeric`: Feature has a numeric value (e.g., storage limit, user seats)
  - `text`: Feature has a text value
- **Dynamic**: New features can be created as needed

#### User Subscriptions
- **Status**: `active`, `trial`, `canceled`, `expired`
- **Auto-renewal**: Can be enabled/disabled
- **Cancellation**: Supports cancellation with reason tracking

### Default Plans

#### Pro Plan
- **Price**: $29.99/month
- **Billing**: Monthly
- **Trial**: 14 days
- **Features**:
  - Blog Access
  - Premium Content
  - API Access
  - Storage: 50GB
  - User Seats: 5
  - Priority Support

---

## API Usage

### RBAC Routes

#### Roles (`api.rbac.roles`)

```typescript
// List all roles
const roles = await api.rbac.roles.list.query({
  page: 1,
  pageSize: 10,
  search: "admin",
});

// Get role by ID or slug
const role = await api.rbac.roles.get.query({
  slug: "admin"
});

// Create role
const newRole = await api.rbac.roles.create.mutate({
  name: "Content Manager",
  slug: "content-manager",
  description: "Manages all content",
  permissionIds: ["perm-id-1", "perm-id-2"],
});

// Update role
await api.rbac.roles.update.mutate({
  id: "role-id",
  name: "Updated Name",
  permissionIds: ["perm-id-1"],
});

// Delete role
await api.rbac.roles.delete.mutate({
  id: "role-id",
});

// Assign role to user
await api.rbac.roles.assignToUser.mutate({
  userId: "user-id",
  roleId: "role-id",
  expiresAt: new Date("2025-12-31"), // Optional
});

// Remove role from user
await api.rbac.roles.removeFromUser.mutate({
  userId: "user-id",
  roleId: "role-id",
});
```

#### Permissions (`api.rbac.permissions`)

```typescript
// List permissions
const permissions = await api.rbac.permissions.list.query({
  page: 1,
  pageSize: 10,
  resource: "blog_post",
});

// Create permission
await api.rbac.permissions.create.mutate({
  name: "Create Blog Post",
  slug: "blog_post-create",
  description: "Allows creating blog posts",
  resource: "blog_post",
  action: "create",
});

// Check if user has permission
const { hasPermission } = await api.rbac.permissions.check.query({
  userId: "user-id",
  resource: "blog_post",
  action: "create",
});

// Get current user's permissions
const myPermissions = await api.rbac.permissions.myPermissions.query();
```

### Subscription Routes

#### Plans (`api.subscriptions.plans`)

```typescript
// List plans
const plans = await api.subscriptions.plans.list.query({
  page: 1,
  pageSize: 10,
  isActive: true,
});

// Get plan by slug
const plan = await api.subscriptions.plans.get.query({
  slug: "pro"
});

// Create plan (admin only)
await api.subscriptions.plans.create.mutate({
  name: "Enterprise",
  slug: "enterprise",
  description: "For large teams",
  price: 99.99,
  currency: "USD",
  billingInterval: "month",
  trialDays: 30,
  featureIds: [
    { featureId: "feature-id-1" },
    { featureId: "feature-id-2", value: "100" },
  ],
});
```

#### Features (`api.subscriptions.features`)

```typescript
// List all features
const features = await api.subscriptions.features.list.query();

// Create feature (admin only)
await api.subscriptions.features.create.mutate({
  name: "API Rate Limit",
  slug: "api-rate-limit",
  description: "API requests per hour",
  featureType: "numeric",
});
```

#### User Subscriptions (`api.subscriptions.subscriptions`)

```typescript
// Get my current subscription
const mySubscription = await api.subscriptions.subscriptions.myCurrent.query();

// List subscriptions
const subscriptions = await api.subscriptions.subscriptions.list.query({
  page: 1,
  pageSize: 10,
  status: "active",
});

// Create subscription
await api.subscriptions.subscriptions.create.mutate({
  userId: "user-id",
  planId: "plan-id",
  paymentMethod: "credit_card",
});

// Cancel subscription
await api.subscriptions.subscriptions.cancel.mutate({
  id: "subscription-id",
  reason: "Not using the service anymore",
});

// Check feature access
const { hasAccess, value } = await api.subscriptions.subscriptions.checkFeature.query({
  userId: "user-id",
  featureSlug: "api-rate-limit",
});

// Get my features
const myFeatures = await api.subscriptions.subscriptions.myFeatures.query();
```

---

## Helper Functions

Located in `src/server/api/rbac.ts`:

### Permission Checks

```typescript
import { hasPermission, requirePermission } from "~/server/api/rbac";

// Check if user has permission (returns boolean)
const canCreate = await hasPermission(db, userId, "blog_post", "create");

// Require permission (throws TRPCError if not authorized)
await requirePermission(db, userId, "blog_post", "create");
```

### Role Checks

```typescript
import { hasRole, requireRole } from "~/server/api/rbac";

// Check if user has role (returns boolean)
const isAdmin = await hasRole(db, userId, "admin");

// Require role (throws TRPCError if not authorized)
await requireRole(db, userId, "admin");
```

### Feature Access

```typescript
import { hasFeatureAccess, requireFeatureAccess } from "~/server/api/rbac";

// Check feature access (returns { hasAccess, value? })
const { hasAccess, value } = await hasFeatureAccess(db, userId, "api-access");

// Require feature access (throws TRPCError if not authorized)
const limitValue = await requireFeatureAccess(db, userId, "api-rate-limit");
```

### Get User Permissions

```typescript
import { getUserPermissions } from "~/server/api/rbac";

const permissions = await getUserPermissions(db, userId);
// Returns: [{ resource: "blog_post", action: "create" }, ...]
```

---

## Database Schema

### Core Tables

- **Role**: Defines roles with name, slug, description
- **Permission**: Defines permissions with resource and action
- **RolePermission**: Maps roles to permissions (many-to-many)
- **UserRole**: Maps users to roles with optional expiration (many-to-many)
- **SubscriptionPlan**: Defines subscription plans with pricing
- **Feature**: Defines available features
- **PlanFeature**: Maps plans to features with values (many-to-many)
- **UserSubscription**: Tracks user subscriptions

---

## Seeded Data

Run `pnpm db:seed` to initialize:

### Permissions (29 total)
- Blog: create, read, update, delete
- Category: manage
- Tag: manage
- Comment: approve, delete
- User: manage
- Role: create, read, update, delete
- Permission: create, read, update, delete
- User Role: create, delete
- Subscription: create, read, update, delete
- Subscription Plan: create, update, delete
- Feature: create, update, delete

### Roles (4)
- Admin (all permissions)
- Author (blog management)
- Moderator (content moderation)
- User (read access)

### Features (6)
- Blog Access
- Premium Content
- API Access
- Storage Limit
- User Seats
- Priority Support

### Plans (2)
- Free (lifetime, $0)
- Pro (monthly, $29.99, 14-day trial)

---

## Example: Protecting a Route

```typescript
import { protectedProcedure } from "~/server/api/trpc";
import { requirePermission, requireFeatureAccess } from "~/server/api/rbac";

export const myRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createDto)
    .mutation(async ({ ctx, input }) => {
      // Check permission
      await requirePermission(ctx.db, ctx.session.user.id, "blog_post", "create");
      
      // Check feature access
      await requireFeatureAccess(ctx.db, ctx.session.user.id, "premium-content");
      
      // Proceed with creation
      return await ctx.db.blogPost.create({...});
    }),
});
```

---

## Notes

- All RBAC and subscription operations require authentication
- Admin operations require specific permissions
- System roles cannot be deleted
- Expired roles are automatically filtered out
- Subscriptions can be canceled but not deleted
- Features are plan-specific and checked against active subscriptions

