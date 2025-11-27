# App Structure Documentation

## Overview

The application is structured using Next.js 13+ App Router with **Route Groups** to organize pages by purpose and apply different layouts conditionally.

## 🏗️ Route Groups Structure

```
src/app/
├── layout.tsx                    # Root layout (globals, providers, fonts)
├── (public)/                     # Public pages with header + footer
│   ├── layout.tsx                # Public layout (Header + Footer)
│   ├── page.tsx                  # Home page
│   ├── about/
│   ├── account/                  # User account settings
│   ├── blog/
│   ├── club/
│   ├── contact/
│   ├── drag/
│   ├── drift/
│   ├── news/
│   ├── privacy/
│   ├── products/
│   ├── shop/
│   ├── support/
│   └── terms/
├── (auth-pages)/                 # Authentication pages with header only
│   ├── layout.tsx                # Auth layout (Header only, no footer)
│   └── auth/
│       ├── sign-in/
│       ├── sign-up/
│       ├── forgot-password/
│       └── reset-password/
├── admin/                        # Admin panel (separate layout)
│   ├── layout.tsx                # Admin layout (Header + Sidebar, no footer)
│   ├── page.tsx                  # Dashboard
│   ├── users/
│   ├── posts/
│   ├── news/
│   ├── plans/
│   ├── features/
│   └── settings/
└── api/                          # API routes (no layout)
    ├── auth/
    └── trpc/
```

## 📁 Route Groups Explained

### What are Route Groups?

Route groups in Next.js allow you to organize routes without affecting the URL structure. Groups are denoted by parentheses `(group-name)`.

**Key Benefits**:
- Different layouts for different sections
- URL structure remains clean (groups don't appear in URL)
- Better code organization
- Conditional rendering of components (header/footer)

### (public) Group

**Purpose**: Public-facing pages and user account pages

**Layout Features**:
- ✅ Header (navigation)
- ✅ Footer (links, newsletter)
- ✅ Responsive design
- ✅ Full-width content

**Pages**:
- Home (`/`)
- About (`/about`)
- Blog (`/blog`)
- Account Settings (`/account`)
- Shop, Contact, News, etc.

**URL Examples**:
- `https://example.com/` → Home
- `https://example.com/blog` → Blog
- `https://example.com/account` → Account

**Layout File**: `(public)/layout.tsx`
```tsx
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
```

### (auth-pages) Group

**Purpose**: Authentication and password reset pages

**Layout Features**:
- ✅ Header (navigation to return to site)
- ❌ Footer (cleaner auth experience)
- ✅ Centered forms
- ✅ Full-height layouts

**Pages**:
- Sign In (`/auth/sign-in`)
- Sign Up (`/auth/sign-up`)
- Forgot Password (`/auth/forgot-password`)
- Reset Password (`/auth/reset-password`)

**URL Examples**:
- `https://example.com/auth/sign-in`
- `https://example.com/auth/sign-up`

**Layout File**: `(auth-pages)/layout.tsx`
```tsx
import { Header } from "~/components/header";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
    </>
  );
}
```

### admin Group

**Purpose**: Admin panel pages (not in parentheses - we want `/admin` in URL)

**Layout Features**:
- ✅ Header (navigation)
- ✅ Fixed Sidebar (admin navigation)
- ❌ Footer (admin-focused UI)
- ✅ Protected routes (RBAC)
- ✅ Custom admin design

**Pages**:
- Dashboard (`/admin`)
- Users (`/admin/users`)
- Posts (`/admin/posts`)
- News (`/admin/news`)
- Plans (`/admin/plans`)
- Features (`/admin/features`)
- Settings (`/admin/settings`)

**URL Examples**:
- `https://example.com/admin`
- `https://example.com/admin/users`

**Layout File**: `admin/layout.tsx`
```tsx
import { Header } from "~/components/header";

export default async function AdminLayout({ children }) {
  // Auth & RBAC checks...
  
  return (
    <>
      <Header />
      <div className="flex min-h-screen pt-16">
        <aside>{/* Sidebar */}</aside>
        <main>{children}</main>
      </div>
    </>
  );
}
```

## 🎨 Root Layout

The root layout now contains only **global providers and styles**:

**File**: `app/layout.tsx`

**Responsibilities**:
- Global CSS imports
- Font configuration
- Theme providers
- tRPC provider
- Animated background
- HTML/body wrapper

**Does NOT Include**:
- ❌ Header (moved to group layouts)
- ❌ Footer (moved to public layout only)

```tsx
import { Providers } from "~/components/providers";
import { TRPCReactProvider } from "~/trpc/react";
import { AnimatedMeshBackground } from "~/components/animated-mesh-background";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        <AnimatedMeshBackground />
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
```

## 📊 Layout Hierarchy

```
Root Layout (globals, providers)
├── Public Layout (header + footer)
│   └── Public Pages
├── Auth Layout (header only)
│   └── Auth Pages
└── Admin Layout (header + sidebar)
    └── Admin Pages
```

## 🎯 Why This Structure?

### Before (Problems)
- ❌ Footer appeared on admin pages (unwanted)
- ❌ Hard to conditionally render layouts
- ❌ Complex conditional logic in root layout
- ❌ Single layout for all pages

### After (Benefits)
- ✅ Clean separation of concerns
- ✅ Footer only on public pages
- ✅ Each section has appropriate layout
- ✅ Easy to maintain and extend
- ✅ URL structure unchanged (route groups)
- ✅ Better performance (less conditional logic)

## 🚀 Adding New Pages

### Adding a Public Page

Create in `(public)` folder:
```bash
mkdir -p src/app/\(public\)/my-page
echo "export default function MyPage() { return <div>My Page</div>; }" > src/app/\(public\)/my-page/page.tsx
```

URL will be: `/my-page` (group name not in URL)
Will have: Header + Footer

### Adding an Auth Page

Create in `(auth-pages)/auth` folder:
```bash
mkdir -p src/app/\(auth-pages\)/auth/my-auth
echo "export default function MyAuth() { return <div>Auth Page</div>; }" > src/app/\(auth-pages\)/auth/my-auth/page.tsx
```

URL will be: `/auth/my-auth`
Will have: Header only

### Adding an Admin Page

Create in `admin` folder:
```bash
mkdir -p src/app/admin/my-admin
echo "export default function MyAdmin() { return <div>Admin Page</div>; }" > src/app/admin/my-admin/page.tsx
```

URL will be: `/admin/my-admin`
Will have: Header + Sidebar

## 🔍 URL Structure

**Important**: Route groups `(name)` do not appear in URLs!

| File Path | URL | Layout |
|-----------|-----|--------|
| `(public)/page.tsx` | `/` | Header + Footer |
| `(public)/about/page.tsx` | `/about` | Header + Footer |
| `(public)/blog/page.tsx` | `/blog` | Header + Footer |
| `(auth-pages)/auth/sign-in/page.tsx` | `/auth/sign-in` | Header only |
| `admin/page.tsx` | `/admin` | Header + Sidebar |
| `admin/users/page.tsx` | `/admin/users` | Header + Sidebar |

## 🛠️ Migration Notes

### Files Moved

**To `(public)`**:
- All public pages (home, about, blog, etc.)
- Account settings page
- Shop, contact, news, etc.

**To `(auth-pages)`**:
- `auth/` folder with all auth pages

**Kept in Root**:
- `admin/` (needs `/admin` in URL)
- `api/` (API routes, no layout)

### Breaking Changes

**None!** URLs remain exactly the same:
- `/` still works
- `/blog` still works
- `/auth/sign-in` still works
- `/admin` still works

### Code Changes Required

**None in page components!** All imports and links work the same.

## 📝 Best Practices

### 1. Choose the Right Group

- **Public pages** with footer → `(public)`
- **Auth pages** without footer → `(auth-pages)`
- **Admin pages** with sidebar → `admin`

### 2. Layout Inheritance

Each group layout receives `children` from root layout:
```
Root → Providers → Group Layout → Page
```

### 3. Shared Components

Header and Footer are imported in group layouts:
- Keeps components DRY
- Single source of truth
- Easy to update

### 4. Performance

Route groups don't add overhead:
- No extra route matching
- Normal React component nesting
- Optimal bundle splitting

## 🐛 Troubleshooting

### Issue: Page has no layout
**Solution**: Check if page is in correct route group folder

### Issue: Footer appears where it shouldn't
**Solution**: Page might be in `(public)` group when it should be elsewhere

### Issue: Admin layout not applying
**Solution**: Ensure admin pages are directly in `admin/` folder, not in a group

### Issue: URLs changed
**Solution**: Route groups don't affect URLs. If URLs changed, pages might be in wrong location.

## 📚 References

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [App Router Documentation](https://nextjs.org/docs/app)

## ✅ Summary

The app is now organized into logical groups:
- **Public** pages have header and footer
- **Auth** pages have only header
- **Admin** pages have header and sidebar
- Root layout handles only global concerns
- URLs remain unchanged
- Easy to maintain and extend

