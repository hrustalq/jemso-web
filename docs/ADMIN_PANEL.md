# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive interface for managing users, content, and subscription plans. It's built with a sidebar navigation layout and is accessible only to users with admin or content_manager roles.

## Features

### ✅ Dashboard
- **Stats Overview**: Total users, blog posts, subscriptions, and plans
- **Quick Actions**: Direct links to management pages
- **Activity Feed**: Recent activity (placeholder)

### ✅ User Management
- **User List**: View all registered users with roles and stats
- **User Actions**:
  - Copy user ID/email
  - Manage roles (placeholder)
  - Toggle user status (placeholder)
- **Stats**: Post count per user
- **Filters**: Search and filter capabilities

### ✅ Blog Post Management
- **Post List**: View all blog posts with status, views, and comments
- **Post Actions**:
  - View post (opens in new tab)
  - Edit post (block editor)
  - Delete post (with confirmation)
  - Copy post ID/slug
- **Status Badges**: Published vs Draft
- **Integration**: Uses existing block editor

### ✅ News Management
- **News List**: Manage news articles (uses blog API)
- **News Actions**:
  - View, edit, delete news articles
  - Copy post ID
- **Status Tracking**: Published status, views, author

### ✅ Events Management
- **Event List**: View all events with stats and registration tracking
- **Event CRUD**:
  - Create new events
  - Edit existing events
  - Delete events (with confirmation)
  - Copy event ID/slug
- **Event Details**:
  - Schedule (start/end dates)
  - Location (physical or online)
  - Registration limits
  - Pricing and payment tracking
- **Registration Management**:
  - Track participant registrations
  - Manage payment status
  - View registration stats
- **Status Tracking**: Published, upcoming, past, full
- **Integration**: Uses block editor for rich content

### ✅ Categories Management
- **Category List**: View all categories with usage stats
- **Category CRUD**:
  - Create new categories
  - Edit existing categories
  - Delete categories (protected if in use)
  - Copy category ID
- **Usage Tracking**: Shows blog posts and events using each category
- **Slug Auto-generation**: Auto-generates slug from category name
- **Protection**: Cannot delete categories used in blog posts or events

### ✅ Subscription Plans
- **Plan List**: View all subscription plans with features
- **Plan CRUD**:
  - Create new plans
  - Edit existing plans
  - Delete plans (with confirmation)
  - Toggle active status
- **Features Management**:
  - Select plan features
  - Set feature values (for numeric features)
  - View feature types (boolean, numeric, text)
- **Pricing Configuration**:
  - Set price and currency
  - Choose billing period (monthly, yearly, lifetime)
  - Configure trial days

### ✅ Features Management
- **Feature List**: View all features with type badges
- **Feature CRUD**:
  - Create new features
  - Edit existing features
  - Delete features (with protection if used in plans)
  - Copy feature ID
- **Feature Types**:
  - Boolean: Simple yes/no features
  - Numeric: Features with numeric values (storage, limits)
  - Text: Features with custom text values
- **Usage Tracking**: Shows how many plans use each feature
- **Slug Auto-generation**: Auto-generates slug from feature name

### ✅ Settings
- **General Settings**: (placeholder)
- **Email Settings**: (placeholder)
- **Security Settings**: (placeholder)

## Access Control

### Required Roles

The admin panel requires one of the following roles:
- **admin**: Full access to all admin features
- **content_manager**: Access to content management features

### Route Protection

All admin routes are protected at the layout level:

```typescript
// Automatic redirect if not authenticated
if (!session) {
  redirect("/auth/sign-in?callbackUrl=/admin");
}

// Automatic redirect if no admin/content_manager role
if (!isAdmin && !isContentManager) {
  redirect("/");
}
```

## Layout Structure

### Sidebar Navigation
- **Position**: Fixed left sidebar
- **Width**: 64 (16rem / 256px)
- **Height**: Full viewport minus header (h-[calc(100vh-4rem)])
- **Navigation Items**:
  - Dashboard
  - Users
  - Events
  - Blog Posts
  - News
  - Categories
  - Subscription Plans
  - Features
  - Settings

### Main Content Area
- **Margin**: ml-64 to offset sidebar
- **Padding**: p-8
- **Layout**: Responsive grid and flex layouts

### Header Display
- Shows admin user name/email
- "Back to Site" link in footer

## Pages

### Dashboard (`/admin`)

**Stats Cards**:
- Total Users
- Blog Posts
- Events
- Categories
- Active Subscriptions
- Subscription Plans
- Features

**Features**:
- Real-time stats from database
- Clickable cards leading to management pages
- Recent activity section (placeholder)

### Users (`/admin/users`)

**Table Columns**:
- Name
- Email
- Roles (badges)
- Posts count
- Join date
- Actions

**Features**:
- View all registered users
- See user roles with expiration
- Track user activity (post count)
- Action dropdown for management

### Blog Posts (`/admin/posts`)

**Table Columns**:
- Title (with preview link)
- Category
- Author
- Status (published/draft)
- Views
- Comments count
- Published date
- Actions

**Features**:
- Create new posts (redirects to block editor)
- Edit existing posts
- Delete posts with confirmation
- View posts in new tab
- Real-time stats

### News (`/admin/news`)

**Table Columns**:
- Title
- Category
- Author
- Status
- Views
- Published date
- Actions

**Features**:
- Same as blog posts (uses blog API)
- Specialized for news articles
- Create new news articles

### Events (`/admin/events`)

**Table Columns**:
- Title
- Category
- Start Date
- End Date
- Status (Published/Draft/Upcoming/Past/Full)
- Registrations (current/max)
- Price
- Actions

**Create/Edit Event Form**:

**Basic Information**:
- Event title
- Slug (auto-generated, immutable)
- Short description (excerpt)
- Full description (with block editor support)
- Cover image
- Category
- Published status

**Event Schedule**:
- Start date & time
- End date & time

**Location**:
- Location name (physical address or "Online Event")
- Location URL (meeting link or map link)

**Registration & Pricing**:
- Maximum participants (optional, unlimited if not set)
- Price (0 for free events)
- Currency (USD, EUR, GBP, RUB)

**Features**:
- Create and manage events
- Track registrations and participants
- Set participant limits
- Free or paid events
- Online or physical events
- Multiple currency support
- Status badges (upcoming, past, full)
- Auto-slug generation

### Categories (`/admin/categories`)

**Table Columns**:
- Name
- Slug (with code styling)
- Description
- Blog Posts count
- Events count
- Created date
- Actions

**Create/Edit Category Form**:

**Category Details**:
- Category name
- Slug (auto-generated, immutable after creation)
- Description (optional, 500 chars max)

**Features**:
- Create and manage categories
- Shared between blog posts and events
- Usage tracking (posts and events count)
- Auto-slug generation
- Protection (cannot delete if in use)
- Shows warning if category is used in content

### Subscription Plans (`/admin/plans`)

**Table Columns**:
- Name
- Price (with currency)
- Billing Period
- Features count
- Active Subscriptions
- Status (active/inactive)
- Actions

**Create/Edit Plan Form**:

**Basic Information**:
- Plan name
- Slug (auto-generated, immutable)
- Description
- Active status toggle

**Pricing**:
- Price (decimal)
- Currency (USD, EUR, etc.)
- Billing period (monthly, yearly, lifetime)
- Trial days

**Features**:
- Select from available features
- Toggle feature inclusion
- Set numeric values for numeric features
- View feature types and descriptions

### Features (`/admin/features`)

**Table Columns**:
- Name
- Slug (with code styling)
- Type (with color-coded badges)
- Description
- Used In Plans (count)
- Created date
- Actions

**Create/Edit Feature Form**:

**Feature Details**:
- Feature name
- Slug (auto-generated, immutable after creation)
- Description
- Feature type (boolean, numeric, text)

**Feature Types**:
- **Boolean**: Simple yes/no features (e.g., "Priority Support")
- **Numeric**: Features with numeric values (e.g., "50GB Storage", "1000 API Calls")
- **Text**: Features with custom text values (e.g., "Custom Domain")

**Protection**:
- Cannot delete features that are used in plans
- Shows warning if feature is used
- Slug and type cannot be changed after creation

### Settings (`/admin/settings`)

**Sections**:
- General Settings (placeholder)
- Email Settings (placeholder)
- Security Settings (placeholder)

## API Integration

### Users
```typescript
// Get users list (server-side)
const users = await db.user.findMany({
  include: {
    userRoles: { include: { role: true } },
    _count: { select: { blogPosts: true } }
  }
});
```

### Blog Posts
```typescript
// Get posts list (tRPC)
const posts = await api.blog.posts.list({
  page: 1,
  pageSize: 50,
  published: undefined
});

// Delete post (tRPC mutation)
api.blog.posts.delete.useMutation({
  onSuccess: () => router.refresh()
});
```

### Subscription Plans
```typescript
// Get plans list (tRPC)
const plans = await api.subscriptions.plans.list.query({
  page: 1,
  pageSize: 10,
  isActive: true
});

// Create plan (tRPC mutation)
api.subscriptions.plans.create.useMutation({
  onSuccess: () => router.push("/admin/plans")
});

// Update plan (tRPC mutation)
api.subscriptions.plans.update.useMutation({
  onSuccess: () => router.refresh()
});
```

## Components

### Shared Components

**Table Components** (`~/components/ui/table.tsx`):
- Table, TableHeader, TableBody
- TableRow, TableHead, TableCell
- Responsive with overflow-auto

**Action Dropdowns**:
- UserActions: User management actions
- PostActions: Post management actions
- NewsActions: News management actions
- PlanActions: Plan management actions

**Forms**:
- PlanForm: Create/edit subscription plans with features

### Component Patterns

All action components follow this pattern:
```typescript
"use client";

interface ActionsProps {
  itemId: string;
  itemName: string;
}

export function ItemActions({ itemId, itemName }: ActionsProps) {
  const router = useRouter();
  
  const deleteMutation = api.items.delete.useMutation({
    onSuccess: () => router.refresh()
  });

  // Handler functions...
  
  return (
    <DropdownMenu>
      {/* Menu items */}
    </DropdownMenu>
  );
}
```

## Styling

### Colors
- Primary: Red accent (#D32F2F equivalent)
- Background: Dark theme
- Cards: Elevated with borders
- Hover: Accent color transitions

### Spacing
- Section padding: p-8
- Card spacing: gap-6
- Form spacing: space-y-4
- Grid gaps: gap-4 to gap-6

### Typography
- Page titles: text-3xl font-bold tracking-tight
- Descriptions: text-muted-foreground mt-2
- Table text: text-sm
- Labels: font-medium

## Responsive Design

### Mobile (< 1024px)
- Sidebar collapses or becomes hamburger menu (TODO)
- Tables scroll horizontally
- Single column layouts

### Desktop (>= 1024px)
- Fixed sidebar navigation
- Multi-column grids
- Optimal table layouts

## Future Enhancements

### User Management
- [ ] Role assignment modal
- [ ] User status toggle (active/suspended)
- [ ] User detail page
- [ ] Bulk actions
- [ ] Advanced filters

### Content Management
- [ ] Bulk post operations
- [ ] Category management interface
- [ ] Tag management interface
- [ ] Comment moderation
- [ ] Media library

### Plans Management
- [ ] Feature management interface
- [ ] Plan comparison view
- [ ] Usage analytics
- [ ] Subscription cancellation handling

### General
- [ ] Mobile-responsive sidebar
- [ ] Activity log
- [ ] Notifications system
- [ ] Export functionality
- [ ] Advanced search
- [ ] Keyboard shortcuts

## Security

### Authentication
- Session-based authentication
- Server-side role checks
- Automatic redirects

### Authorization
- Role-based access control (RBAC)
- Permission checks at API level
- Layout-level protection

### Data Protection
- Confirmation dialogs for destructive actions
- CSRF protection (via NextAuth)
- Input validation (tRPC + Zod)

## Testing

### Manual Testing Checklist

**Dashboard**:
- [ ] Stats display correctly
- [ ] Cards link to correct pages
- [ ] Data updates in real-time

**Users**:
- [ ] User list loads
- [ ] Roles display correctly
- [ ] Actions work as expected

**Blog Posts**:
- [ ] Post list loads with all data
- [ ] Edit redirects to block editor
- [ ] Delete confirms and removes post
- [ ] View opens in new tab

**Plans**:
- [ ] Plan list shows all plans
- [ ] Create form validates input
- [ ] Edit form pre-fills data
- [ ] Features toggle correctly
- [ ] Delete removes plan

## Related Documentation

- [RBAC and Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)
- [Authentication](./AUTHENTICATION.md)
- [Layout Spacing](./LAYOUT_SPACING.md)
- [Page Builder](./PAGE_BUILDER.md)

## Usage Example

```typescript
// Protect a custom admin page
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasRole } from "~/server/api/rbac";
import { db } from "~/server/db";

export default async function CustomAdminPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/admin/custom");
  }
  
  const isAdmin = await hasRole(db, session.user.id, "admin");
  
  if (!isAdmin) {
    redirect("/");
  }
  
  return <div>Custom Admin Content</div>;
}
```

## Notes

- All admin pages use the shared admin layout
- Sidebar navigation is fixed and always visible on desktop
- All forms use tRPC mutations for API calls
- Tables use shadcn/ui Table component
- Action dropdowns use shadcn/ui DropdownMenu
- All destructive actions require confirmation
- Success/error states handled with alerts and toasts

