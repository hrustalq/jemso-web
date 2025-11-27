# Gran Turismo-Inspired Design System

This document describes the Gran Turismo-inspired visual design system implemented in the Jemso project.

## 🎨 Design Philosophy

Inspired by the iconic [Gran Turismo website](https://www.gran-turismo.com/us/), our design emphasizes:

- **Bold, Racing-Inspired Aesthetics**: High-contrast colors, dramatic glows, and dynamic effects
- **Premium Feel**: Glowing mesh gradients and sophisticated backgrounds
- **Performance-Oriented**: Smooth animations with GSAP, optimized rendering
- **Modern & Clean**: Dark theme with vibrant accent colors

## 🌈 Visual Elements

### 1. Global Mesh Background

**Component**: `src/components/animated-mesh-background.tsx`

A full-screen animated mesh gradient that creates depth and visual interest across the entire site.

**Features**:
- 6 animated gradient orbs with racing-inspired colors (red, blue, purple, pink)
- Smooth GSAP-powered float animations
- Heavy blur (120px) for soft, glowing effect
- Fixed position, non-scrolling
- Higher opacity in dark mode for dramatic effect

**Colors Used**:
```javascript
// Dark Mode
"rgba(220, 38, 38, 0.4)"   // Red glow - primary racing color
"rgba(37, 99, 235, 0.3)"   // Blue glow
"rgba(168, 85, 247, 0.25)" // Purple glow
"rgba(236, 72, 153, 0.2)"  // Pink glow
"rgba(59, 130, 246, 0.25)" // Light blue glow
"rgba(239, 68, 68, 0.3)"   // Bright red glow

// Light Mode
// Same colors with reduced opacity (0.08-0.15)
```

**Usage**: Already integrated in root layout - no manual setup needed.

---

### 2. Section Mesh Backgrounds

**Component**: `src/components/section-mesh-background.tsx`

Localized mesh gradient backgrounds for individual sections, creating visual variety throughout the page.

**Props**:
```typescript
interface SectionMeshBackgroundProps {
  variant?: "red" | "blue" | "purple" | "pink" | "multi";
  intensity?: "low" | "medium" | "high";
  className?: string;
}
```

**Variants**:
- `red` - Racing red theme (perfect for hero sections)
- `blue` - Cool blue theme (great for content sections)
- `purple` - Premium purple theme (ideal for pricing/features)
- `pink` - Vibrant pink theme (excellent for shop/products)
- `multi` - Mixed colors (best for hero sections)

**Intensity Levels**:
- `low` - 2 orbs, 200px radius, subtle effect
- `medium` - 3 orbs, 300px radius, balanced effect
- `high` - 4 orbs, 400px radius, dramatic effect

**Usage**:
```tsx
<section className="relative">
  <SectionMeshBackground variant="red" intensity="high" />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</section>
```

**Examples from Homepage**:
```tsx
// Hero Section - Bold multi-color
<SectionMeshBackground variant="multi" intensity="high" />

// Categories Section - Racing red
<SectionMeshBackground variant="red" intensity="medium" />

// Events Section - Cool purple
<SectionMeshBackground variant="purple" intensity="low" />

// News Section - Tech blue
<SectionMeshBackground variant="blue" intensity="medium" />

// Plans Section - Premium purple
<SectionMeshBackground variant="purple" intensity="medium" />

// Shop Section - Vibrant pink
<SectionMeshBackground variant="pink" intensity="low" />
```

---

### 3. Fixed Background Image Layer

**Location**: `src/app/(public)/layout.tsx`

A full-page fixed background image that appears across all public pages.

**Key Features**:
- Fixed position, non-scrolling (stays in place while content scrolls)
- Covers entire viewport without cropping
- Subtle opacity with glow effects
- Multiple overlay layers for depth and readability

**Visual Layers** (bottom to top):
1. Fixed car background image with subtle blur
2. Radial red glow overlay (centered)
3. Gradient overlay (top → middle → bottom for depth)

**Implementation**:
```tsx
{/* Fixed Background Image Layer */}
<div className="pointer-events-none fixed inset-0 z-0">
  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] dark:opacity-[0.08]" />
  <div className="absolute inset-0 bg-[radial-gradient(...)]" />
  <div className="absolute inset-0 bg-linear-to-b..." />
</div>
```

---

### 4. Hero Section Updates

**Component**: `src/components/animated-hero.tsx`

Simplified hero component without rounded corners or borders.

**Key Changes**:
- Full-width design (no rounded corners or borders)
- No local background image (uses page-level image)
- Clean, minimal design
- Content remains centered with container inside

**Usage**:
```tsx
<AnimatedHero
  title="JEMSO DRIVE"
  subtitle="Радость в движении!"
  description="Experience the thrill..."
/>
```

---

### 5. Animated Hero Section

**Component**: `src/components/animated-hero-section.tsx`

The main homepage hero with Gran Turismo-inspired effects.

**Features**:
- No rounded corners or borders (clean, full-width design)
- Racing-inspired grid pattern overlay
- Dynamic shimmer animation
- Transparent background with backdrop blur

**Visual Layers** (bottom to top):
1. Page-level fixed car background (from layout)
2. Grid pattern with primary color
3. Animated shimmer effect
4. Content layer

---

## 🎯 Implementation Examples

### Basic Section with Mesh Background

```tsx
<section className="relative py-16">
  <SectionMeshBackground variant="blue" intensity="medium" />
  <div className="container relative z-10">
    <h2>Your Title</h2>
    <p>Your content...</p>
  </div>
</section>
```

### Hero Section with Fixed Background

```tsx
<section className="relative min-h-screen flex items-center">
  <SectionMeshBackground variant="multi" intensity="high" />
  <div className="container relative z-10">
    <AnimatedHeroSection />
  </div>
</section>
```

### Multiple Sections with Different Colors

```tsx
{/* Red theme for categories */}
<section className="relative">
  <SectionMeshBackground variant="red" intensity="medium" />
  <CategoriesContent />
</section>

{/* Blue theme for news */}
<section className="relative">
  <SectionMeshBackground variant="blue" intensity="medium" />
  <NewsContent />
</section>

{/* Purple theme for plans */}
<section className="relative">
  <SectionMeshBackground variant="purple" intensity="medium" />
  <PlansContent />
</section>
```

---

## 🎨 Color System

### Primary Racing Colors (from globals.css)

**Light Theme**:
- Primary: `oklch(0.55 0.22 25)` - GT Red
- Background: `oklch(0.98 0 0)` - Clean white
- Foreground: `oklch(0.09 0 0)` - Deep black

**Dark Theme**:
- Primary: `oklch(0.60 0.24 25)` - Bright GT Red
- Background: `oklch(0.09 0 0)` - Deep black
- Foreground: `oklch(0.98 0 0)` - Clean white

### Mesh Gradient Colors

All mesh gradients use RGBA with alpha for smooth blending and glow effects.

---

## 📐 Layout Considerations

### Z-Index Layering

```
Fixed Background Image (z-0) - non-scrolling page background
Background Mesh (z-0) - global mesh background
Section Mesh (z-0) - section-specific meshes
Content (z-10) - all actual content
Header (z-50) - navigation elements
```

### Positioning

- **Fixed Background**: `fixed inset-0 z-0` - covers entire viewport, doesn't scroll
- **Global Mesh**: `fixed inset-0 -z-10` - covers entire viewport, doesn't scroll
- **Section Mesh**: `absolute inset-0` - contained within section
- **Content**: `relative z-10` - ensures content appears above meshes

### Performance

- Uses `requestAnimationFrame` for smooth 60fps animations
- Canvas-based rendering for optimal performance
- GSAP for hardware-accelerated animations
- Cleanup on unmount to prevent memory leaks

---

## 🚀 Best Practices

### DO:
✅ Use `relative` positioning on sections containing mesh backgrounds
✅ Apply `z-10` to content containers to ensure proper layering
✅ Choose mesh variants that match section purpose (red for action, blue for info)
✅ Balance intensity across the page (don't use all high intensity)
✅ Use `backdrop-blur` on cards over mesh backgrounds for depth

### DON'T:
❌ Nest mesh backgrounds inside each other
❌ Use same variant/intensity for adjacent sections
❌ Forget to add `relative z-10` to content
❌ Override mesh background colors inline
❌ Use more than one global mesh background

---

## 🎬 Animation Performance

All animations use GSAP with:
- Hardware-accelerated transforms
- Optimized easing functions
- Proper cleanup on unmount
- Respect for `prefers-reduced-motion`

---

## 📱 Responsive Behavior

- Mesh gradients adapt to viewport size
- Orb positions adjust on window resize
- Animation speeds remain consistent
- Touch devices get same visual quality

---

## 🔧 Customization

### Creating Custom Variants

Add new color schemes in `section-mesh-background.tsx`:

```typescript
const colorSchemes = {
  // ... existing variants
  custom: {
    dark: ["rgba(R, G, B, 0.4)", "rgba(R, G, B, 0.3)", ...],
    light: ["rgba(R, G, B, 0.15)", "rgba(R, G, B, 0.12)", ...],
  },
};
```

### Adjusting Intensity

Modify intensity levels in `section-mesh-background.tsx`:

```typescript
const intensityMap = {
  custom: { radius: 350, count: 3, blur: 110 },
};
```

---

## 📚 Related Documentation

- [GSAP Animations](./GSAP_ANIMATIONS.md) - Core animation system
- [Home Page Enrichment](./HOME_PAGE_ENRICHMENT.md) - Homepage features
- [globals.css](../src/styles/globals.css) - Color system and theming

---

## 🎮 Inspiration

Design inspired by:
- [Gran Turismo Official Site](https://www.gran-turismo.com/us/)
- Racing game aesthetics
- Premium automotive design
- Modern web gradients and glass morphism

---

*Last Updated: November 27, 2025*

