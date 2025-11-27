# Database Integration Documentation

This document outlines how the pages have been updated to fetch data from the database using the blog and RBAC systems.

## Overview

All pages now fetch real data from the PostgreSQL database via tRPC API routes. The integration includes:

- **Homepage**: Displays latest 6 published blog posts
- **Blog Page**: Lists all published posts with category filtering
- **Individual Blog Post**: Full post display with comments
- **Category Pages**: Posts filtered by category
- **News Page**: Latest published posts in list format
- **Newsletter Subscription**: Footer integration for email collection

## Updated Pages

### 1. Homepage (`/`)
**File**: `src/app/page.tsx`

**Data Fetching**:
```typescript
const latestPosts = await api.blog.posts.list({
  page: 1,
  pageSize: 6,
  published: true,
});
```

**Features**:
- Displays 6 latest published blog posts
- Shows post cover image, title, excerpt, category
- Displays view count and comment count
- Links to individual blog posts
- Fallback message when no posts exist

### 2. Blog Page (`/blog`)
**File**: `src/app/blog/page.tsx`

**Data Fetching**:
```typescript
const [posts, categories] = await Promise.all([
  api.blog.posts.list({
    page: 1,
    pageSize: 12,
    published: true,
  }),
  api.blog.categories.list(),
]);
```

**Features**:
- Category navigation bar
- Grid layout of blog posts (12 per page)
- Post metadata (date, category, views, comments)
- Tag display for each post
- Pagination support
- Fallback with YouTube channel promotion

### 3. Individual Blog Post (`/blog/[slug]`)
**File**: `src/app/blog/[slug]/page.tsx`

**Data Fetching**:
```typescript
const post = await api.blog.posts.getBySlug({ slug });
```

**Features**:
- Full post content display
- Cover image
- Author information
- Category and tags
- View counter (auto-increments)
- Comments section
- Back to blog navigation
- 404 handling for non-existent posts

### 4. Category Page (`/blog/category/[slug]`)
**File**: `src/app/blog/category/[slug]/page.tsx`

**Data Fetching**:
```typescript
const category = await api.blog.categories.get({ slug });
const categoryPosts = await api.blog.posts.list({
  page: 1,
  pageSize: 12,
  published: true,
  categoryId: category.id,
});
```

**Features**:
- Category header with description
- Filtered posts by category
- Post count display
- Grid layout matching main blog page

### 5. News Page (`/news`)
**File**: `src/app/news/page.tsx`

**Data Fetching**:
```typescript
const posts = await api.blog.posts.list({
  page: 1,
  pageSize: 10,
  published: true,
});
```

**Features**:
- List-style layout (vs grid on blog page)
- Horizontal card layout with image on left
- Same metadata as blog page
- Responsive design

### 6. Newsletter Component
**File**: `src/components/newsletter-form.tsx`

**Data Mutation**:
```typescript
const subscribe = api.blog.newsletter.subscribe.useMutation({
  onSuccess: () => {
    setSuccess(true);
    setEmail("");
    setName("");
  },
});
```

**Features**:
- Client-side form component
- Email and name input
- Success state display
- Error handling
- Integrated into footer

## RBAC Integration

All blog routers now use the RBAC permission system instead of hardcoded role checks:

### Posts Router Updates
**File**: `src/server/api/routers/blog/posts.ts`

- **View unpublished posts**: Checks `blog_post:read` permission
- **Create posts**: Requires `blog_post:create` permission
- **Update posts**: Owner can edit own posts, or requires `blog_post:update` permission
- **Delete posts**: Owner can delete own posts, or requires `blog_post:delete` permission

### Categories Router Updates
**File**: `src/server/api/routers/blog/categories.ts`

- **Create category**: Requires `category:create` permission
- **Update category**: Requires `category:update` permission
- **Delete category**: Requires `category:delete` permission

### Tags Router Updates
**File**: `src/server/api/routers/blog/tags.ts`

- **Create tag**: Requires `tag:create` permission
- **Update tag**: Requires `tag:update` permission
- **Delete tag**: Requires `tag:delete` permission

### Comments Router Updates
**File**: `src/server/api/routers/blog/comments.ts`

- **Update comment**: Owner can edit own comments, or requires `comment:update` permission
- **Delete comment**: Owner can delete own comments, or requires `comment:delete` permission

## Auth Configuration

**File**: `src/server/auth/config.ts`

Updated to include role and subscription information in the session:

```typescript
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roleId: string | null;
      subscriptionId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    roleId: string | null;
    subscriptionId: string | null;
  }
}
```

Session callback now includes:
- User ID
- Role ID
- Subscription ID

## Data Flow

```
┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Next.js Page     │
│ (Server Component)│
└──────┬───────────┘
       │
       │ Server-side tRPC call
       ▼
┌──────────────────┐
│ tRPC Router      │
│ (API Layer)      │
└──────┬───────────┘
       │
       │ RBAC Check (if protected)
       ▼
┌──────────────────┐
│ Prisma Client    │
│ (Database Layer) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ PostgreSQL       │
│ (Data Storage)   │
└──────────────────┘
```

## Key Features

1. **Server-Side Rendering**: All data fetching happens on the server for better SEO and initial load performance

2. **Parallel Data Fetching**: Uses `Promise.all` where appropriate to minimize waterfall requests

3. **Type Safety**: End-to-end type safety from database to UI using Prisma, tRPC, and TypeScript

4. **Permission-Based Access**: Dynamic RBAC system controls who can perform actions

5. **Loading States**: Proper fallbacks for empty data states

6. **Error Handling**: 404 pages for missing content, error boundaries where needed

## Next Steps

To fully utilize the system, you'll need to:

1. **Create Content**: Use the blog API endpoints to create posts, categories, and tags
2. **Assign Roles**: Use the RBAC admin endpoints to assign roles and permissions to users
3. **Set Up Subscriptions**: Configure subscription plans and features
4. **Add Admin UI**: Create admin pages to manage content, users, roles, and subscriptions
5. **Implement Guards**: Add subscription-level access checks for premium content

## API Endpoints Reference

### Blog Posts
- `api.blog.posts.list()` - List published posts
- `api.blog.posts.getBySlug()` - Get single post by slug
- `api.blog.posts.create()` - Create new post (protected)
- `api.blog.posts.update()` - Update post (protected)
- `api.blog.posts.delete()` - Delete post (protected)

### Categories
- `api.blog.categories.list()` - List all categories
- `api.blog.categories.get()` - Get single category
- `api.blog.categories.create()` - Create category (protected)
- `api.blog.categories.update()` - Update category (protected)
- `api.blog.categories.delete()` - Delete category (protected)

### Newsletter
- `api.blog.newsletter.subscribe()` - Subscribe to newsletter

### RBAC
- `api.rbac.roles.*` - Role management
- `api.rbac.permissions.*` - Permission management

### Subscriptions
- `api.subscriptions.plans.*` - Subscription plan management
- `api.subscriptions.features.*` - Feature management
- `api.subscriptions.subscriptions.*` - User subscription management

## Testing the Integration

1. **Seed the database**: `pnpm db:seed`
2. **Start the dev server**: `pnpm dev`
3. **Visit the homepage**: See if posts appear (will be empty initially)
4. **Create some test posts**: Use the API or create an admin UI
5. **Test the newsletter**: Try subscribing in the footer
6. **Check permissions**: Try accessing protected endpoints

## Troubleshooting

### No posts appearing
- Ensure posts are marked as `published: true`
- Check the database has data: `pnpm db:studio`
- Verify the tRPC connection is working

### Permission errors
- Check user has the correct role assigned
- Verify role has the necessary permissions
- Review RBAC seed data

### Type errors
- Run `pnpm db:generate` after schema changes
- Restart TypeScript server in your IDE

## Related Documentation

- [RBAC and Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)
- [Database Schema](../prisma/schema.prisma)
- [API Routes](../src/server/api/routers/)

