# Layout Spacing Documentation

This document describes the layout spacing system implemented to accommodate the fixed header and mobile safe areas in the Jemso project.

## 📐 Overview

The application uses a fixed header that stays at the top of the viewport. All page content needs proper spacing to avoid being hidden behind the fixed header. Additionally, the system accounts for mobile device safe areas (notches, rounded corners, home indicators) to ensure content is never obscured.

## 📱 Mobile-First Approach

### Safe Area Support

Modern mobile devices have various screen interruptions:
- **Notches** (iPhone X and later)
- **Rounded corners**
- **Home indicators** (gesture-based navigation)

The layout system automatically detects and adapts to these features using CSS environment variables (`env(safe-area-inset-*)`).

### Viewport Configuration

**Important**: For safe area insets to work, ensure your HTML includes:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

The `viewport-fit=cover` attribute is **essential** for iOS Safari to expose safe area inset values.

## 🎯 Header Specifications

- **Position**: Fixed (`fixed top-0`)
- **Height**: `h-16` (4rem / 64px)
- **Z-Index**: `z-50`
- **Animated**: Uses `AnimatedHeaderWrapper` for show/hide on scroll

## 📏 Spacing System

### CSS Custom Properties

Added to `globals.css`:
```css
:root {
  /* Layout variables */
  --header-height: 4rem; /* 64px / h-16 */
  
  /* Safe area insets for mobile devices (notches, rounded corners) */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  
  /* Content height calculation accounting for header and safe areas */
  --content-height: calc(100vh - var(--header-height) - var(--safe-top) - var(--safe-bottom));
}
```

These variables provide:
- **Consistent header height** across the application
- **Safe area support** for mobile devices with notches and rounded corners
- **Automatic content height** calculation that accounts for all viewport constraints

### Page Content Spacing

All pages now include proper spacing that accounts for both the fixed header and mobile safe areas:

#### Standard Pages (with main element)
```tsx
<main 
  className="min-h-(--content-height)" 
  style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}
>
  {/* Page content */}
</main>
```

**Why this approach?**
- `min-h-(--content-height)` - Uses the calculated content height that accounts for safe areas
- `style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}` - Dynamically adds padding for header + device notch/rounded corners

**Applied to**:
- `/` (Home)
- `/blog`
- `/blog/[slug]`
- `/events/[slug]`
- `/blog/category/[slug]`
- `/about`
- `/shop`
- `/contact`
- `/news`
- `/drift`
- `/drag`
- `/club`
- `/terms`
- `/privacy`

#### Auth Pages (centered layout)
```tsx
<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 pt-24">
  {/* Auth content */}
</div>
```

**Applied to**:
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password`

Note: Auth pages use `pt-24` (6rem) for extra breathing room at the top.

#### Account & Admin Pages
```tsx
<div className="container mx-auto px-4 py-8 pt-24 md:px-6 lg:px-8">
  {/* Account/Admin content */}
</div>
```

**Applied to**:
- `/account`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/[id]/edit`

## 🎨 Container Classes

All pages with `container` class now also include `mx-auto` for proper centering:

```tsx
<div className="container mx-auto px-4">
  {/* Centered container content */}
</div>
```

## 📦 Spacing Values Reference

| Property | CSS Value | Use Case |
|----------|-----------|----------|
| `--header-height` | `4rem` (64px) | Fixed header height |
| `--safe-top` | `env(safe-area-inset-top, 0px)` | Top safe area (notch area) |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | Bottom safe area (home indicator) |
| `--safe-left` | `env(safe-area-inset-left, 0px)` | Left safe area |
| `--safe-right` | `env(safe-area-inset-right, 0px)` | Right safe area |
| `--content-height` | `calc(100vh - var(--header-height) - var(--safe-top) - var(--safe-bottom))` | Available content height |

**Tailwind Classes:**
| Class | CSS Value | Use Case |
|-------|-----------|----------|
| `h-16` | `height: 4rem` | Header height |
| `min-h-(--content-height)` | Uses CSS variable | Main content min-height with safe areas |

## 🔧 Implementation Details

### Safe Area Insets
Mobile devices (especially iPhones X and later) have notches, rounded corners, and home indicators that can interfere with content. The `env(safe-area-inset-*)` CSS functions provide the necessary spacing:

- **Top**: Accounts for notches and status bar area
- **Bottom**: Accounts for home indicator (on gesture-based phones)
- **Left/Right**: Accounts for rounded corners in landscape mode

### Dynamic Padding
Instead of fixed padding values, we use CSS calculations:
```css
paddingTop: calc(var(--header-height) + var(--safe-top))
```
This ensures:
- Header is never covered by device notches
- Content starts below the header
- Works on all devices (desktop shows 0px safe areas)

### Body Padding
The body element automatically adds safe area padding:
```css
body {
  padding-top: var(--safe-top);
  padding-right: var(--safe-right);
  padding-bottom: var(--safe-bottom);
  padding-left: var(--safe-left);
}
```

### Header Positioning
The header accounts for safe areas to ensure it's always fully visible:
```tsx
<header 
  className="fixed top-0 z-50 w-full"
  style={{ paddingTop: 'var(--safe-top)' }}
>
```

## 🎯 Best Practices

1. **New Pages**: Use `min-h-[var(--content-height)]` and dynamic padding for mobile compatibility
2. **Safe Areas**: Always account for safe area insets in fixed/sticky elements
3. **Container Usage**: Ensure containers respect safe areas with proper padding
4. **Responsive Spacing**: The CSS variables automatically adapt to all devices
5. **Testing**: Test on devices with notches (iPhone X+) and in landscape mode
6. **Inline Styles**: Use inline styles for dynamic CSS variables that Tailwind doesn't support

## 📝 Example Implementation

### Standard Page Template (Mobile-First)
```tsx
export default async function YourPage() {
  return (
    <HydrateClient>
      <main 
        className="min-h-(--content-height)" 
        style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}
      >
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content */}
          </div>
        </section>

        {/* Other Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Content */}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
```

**Key Changes:**
- ✅ `min-h-(--content-height)` - Accounts for safe areas (Tailwind CSS variable syntax)
- ✅ Dynamic `paddingTop` - Works on all devices
- ✅ No hardcoded values - Uses CSS variables

### Auth Page Template
```tsx
export default function YourAuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 pt-24">
      <Card className="w-full max-w-md">
        {/* Auth form content */}
      </Card>
    </div>
  );
}
```

### Admin Page Template
```tsx
export default async function YourAdminPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Page Title</h1>
        <p className="text-muted-foreground mt-2">
          Page description
        </p>
      </div>

      {/* Admin content */}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Content Hidden Behind Header on Mobile
**Problem**: Page content is hidden behind the fixed header on notched devices.
**Solution**: Use dynamic padding with CSS variables:
```tsx
style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}
```

### Content Cut Off at Bottom on iPhone
**Problem**: Bottom content is hidden by home indicator.
**Solution**: Ensure you're using `min-h-(--content-height)` which accounts for `--safe-bottom`.

### Header Overlaps Notch Area
**Problem**: Header content is hidden by device notch.
**Solution**: Add safe area padding to header:
```tsx
style={{ paddingTop: 'var(--safe-top)' }}
```

### Landscape Mode Issues
**Problem**: Content is cut off in landscape mode on mobile.
**Solution**: Ensure all fixed elements use safe area insets for left/right:
```tsx
style={{ 
  paddingLeft: 'max(1rem, var(--safe-left))', 
  paddingRight: 'max(1rem, var(--safe-right))' 
}}
```

## 🔄 Related Documentation

- [GSAP Animations](./GSAP_ANIMATIONS.md) - For header animation details
- [LOADING_STATES.md](./LOADING_STATES.md) - For loading state layouts
- [HEADER_RESPONSIVE_DESIGN.md](./HEADER_RESPONSIVE_DESIGN.md) - For header responsive behavior

## ✅ Checklist for New Pages

When creating a new page, ensure:

- [ ] Main wrapper uses `min-h-(--content-height)` for mobile-safe height
- [ ] Dynamic padding is set: `style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}`
- [ ] All `container` classes include `mx-auto`
- [ ] Responsive padding is considered (`px-4 md:px-6 lg:px-8`)
- [ ] Content sections use consistent padding (`py-16` for sections)
- [ ] Test on mobile devices with notches (iPhone X+)
- [ ] Test in landscape mode on mobile
- [ ] Verify fixed/sticky elements respect safe areas

