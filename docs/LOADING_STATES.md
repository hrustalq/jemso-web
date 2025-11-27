# Loading States Documentation

This document describes the loading states and skeleton screens implemented across the Jemso website.

## 📦 Overview

The project uses Next.js 15's [loading.tsx convention](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) to provide smooth loading experiences across all routes. All loaders are animated with GSAP for visual consistency.

## 🎨 Loader Components

### 1. PageLoader

**Location**: `src/components/page-loader.tsx`

A branded full-page loader with animated bars and the JEMSO logo.

**Props**:
```typescript
{
  variant?: "default" | "minimal"
}
```

**Variants**:

**Default**: Full-page loader with logo, animated bars, and loading text
```tsx
<PageLoader />
```

**Minimal**: Compact loader suitable for sections
```tsx
<PageLoader variant="minimal" />
```

**Features**:
- Animated bars with stagger effect
- Pulsing opacity animation
- JEMSO branding
- Loading text in Russian ("Загрузка...")

### 2. SpinnerLoader

**Location**: `src/components/spinner-loader.tsx`

A simple circular spinner with rotation and pulse animations.

**Usage**:
```tsx
<SpinnerLoader />
```

**Features**:
- Continuous rotation animation
- Pulsing scale effect on inner circle
- Primary color themed
- Compact size (48x48px)

## 📄 Page Loading States

### Root Loading (/)

**File**: `src/app/loading.tsx`

Used for the homepage and any route without a specific loading.tsx file.

**Implementation**:
```tsx
import { PageLoader } from "~/components/page-loader";

export default function Loading() {
  return <PageLoader />;
}
```

### Auth Pages Loading

**File**: `src/app/auth/loading.tsx`

Specialized loading state for authentication pages that mimics the auth form layout.

**Features**:
- Card-based layout matching auth pages
- Skeleton UI for form inputs
- Pulsing card animation
- JEMSO branding at top

**Applies to**:
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password`

### Blog Loading

**File**: `src/app/blog/loading.tsx`

Content-aware skeleton that matches the blog page structure.

**Features**:
- Hero section skeleton
- Category tags skeleton (5 tags)
- Blog post card skeletons (6 cards in grid)
- Image placeholders
- Text line skeletons
- Staggered entrance animation

**Structure**:
```
Hero Skeleton
├── Title placeholder
└── Subtitle placeholder

Categories Skeleton
├── Section title
└── 5 tag placeholders

Blog Grid
└── 6 card skeletons
    ├── Image placeholder
    ├── Metadata (date, category)
    ├── Title
    ├── Excerpt
    └── Stats
```

### Account Loading

**File**: `src/app/account/loading.tsx`

Loading state for account/profile pages.

**Features**:
- Header skeleton (title + description)
- Tabs skeleton (4 tabs)
- Form content skeleton
- Card wrapper with border
- Button skeleton

### Generic Page Loading

**Files**: 
- `src/app/about/loading.tsx`
- `src/app/shop/loading.tsx`

Uses the default `PageLoader` component for simple, branded loading states.

## 🎬 Animations

All loaders use GSAP for smooth, performant animations:

### Bar Animation
```typescript
gsap.to(bars, {
  scaleY: 0.3,
  duration: 0.6,
  stagger: {
    each: 0.15,
    repeat: -1,
    yoyo: true,
  },
  ease: "power2.inOut",
});
```

### Pulse Animation
```typescript
gsap.to(element, {
  opacity: 0.8,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
```

### Stagger Cards
```typescript
gsap.from(skeletons, {
  opacity: 0,
  y: 30,
  duration: 0.4,
  stagger: 0.1,
  ease: "power3.out",
});
```

## 🎯 Best Practices

### When to Create Custom Loading States

Create route-specific loading.tsx files when:
1. The page has a unique layout that benefits from content-aware skeletons
2. Users would benefit from seeing structure while loading
3. The page is data-heavy and might take time to load

### When to Use Generic Loader

Use the default `PageLoader` for:
1. Simple pages with minimal structure
2. Pages that load very quickly
3. Admin pages or utility routes

### Skeleton Design Principles

1. **Match the layout**: Skeleton should mirror actual content structure
2. **Show hierarchy**: Use different sizes/weights for titles, text, etc.
3. **Animate tastefully**: Subtle animations (pulse, fade) improve perception
4. **Respect spacing**: Maintain the same margins/padding as real content

## 📝 Examples

### Adding Loading to a New Route

**Step 1**: Create loading.tsx in the route folder
```bash
touch src/app/your-route/loading.tsx
```

**Step 2**: Implement loading component

**Simple page**:
```tsx
import { PageLoader } from "~/components/page-loader";

export default function YourRouteLoading() {
  return <PageLoader />;
}
```

**Complex page with custom skeleton**:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function YourRouteLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Add your animations
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    return () => {
      gsap.killTweensOf(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Your skeleton structure */}
    </div>
  );
}
```

### Using SpinnerLoader in Components

For component-level loading states:

```tsx
"use client";

import { SpinnerLoader } from "~/components/spinner-loader";
import { useState } from "react";

export function MyComponent() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <SpinnerLoader />
      </div>
    );
  }

  return <div>Your content</div>;
}
```

### Using PageLoader for Sections

```tsx
import { PageLoader } from "~/components/page-loader";

export function MySection() {
  return (
    <section className="py-16">
      <PageLoader variant="minimal" />
    </section>
  );
}
```

## 🔧 Customization

### Changing Animation Speed

Edit the duration in the component:

```typescript
gsap.to(element, {
  // Faster
  duration: 0.3,
  
  // Slower
  duration: 1.0,
});
```

### Changing Colors

Loaders use theme colors from globals.css:
- `bg-primary` - Primary brand color
- `bg-muted` - Skeleton backgrounds
- `bg-card` - Card backgrounds

To customize, update your theme colors in `src/styles/globals.css`.

### Adjusting Skeleton Elements

Add or remove skeleton elements based on your content:

```tsx
<div className="space-y-4">
  {/* More skeletons */}
  {[...Array(10)].map((_, i) => (
    <div key={i} className="h-20 animate-pulse rounded bg-muted" />
  ))}
</div>
```

## ⚡ Performance Considerations

1. **Client Components**: Loading.tsx files are client components by default
2. **GSAP Cleanup**: Always cleanup GSAP animations in useEffect return
3. **Lightweight**: Keep loading states simple - they should render fast
4. **CSS Animations**: Use CSS `animate-pulse` for simple effects to reduce JS bundle

## 🎨 Design System Integration

All loaders follow the Gran Turismo-inspired design:
- Clean, minimal aesthetic
- Primary red accent color (`oklch(0.60 0.24 25)`)
- Consistent spacing and typography
- Smooth, professional animations
- Dark theme optimized

## 📚 Resources

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [GSAP Documentation](https://gsap.com/docs/v3/)
- [Skeleton Screen Best Practices](https://www.nngroup.com/articles/skeleton-screens/)

