# GSAP Animations Documentation

This document describes the GSAP animation system implemented in the Jemso project.

## 📦 Installed Packages

- `gsap` (v3.13.0) - Core GSAP animation library
- `@gsap/react` (v2.1.2) - React integration for GSAP

## 🎨 Features Implemented

### 1. Animated Mesh Background

**Component**: `src/components/animated-mesh-background.tsx`

A beautiful, animated gradient mesh background that adds depth and visual interest to the entire site.

**Features**:
- Dynamic gradient orbs that float across the screen
- Smooth GSAP-powered animations
- Theme-aware colors (adapts to light/dark mode)
- Performance optimized with canvas rendering
- Placed at `opacity-30` to not overpower content

**Usage**:
Already integrated in the root layout (`src/app/layout.tsx`).

### 2. Animated Components

#### AnimatedHero
**Component**: `src/components/animated-hero.tsx`

Hero section with dramatic entrance animations.

**Props**:
```typescript
{
  title: string;          // Main title
  subtitle: string;       // Subtitle
  description?: string;   // Optional description
}
```

**Animations**:
- Title: 3D rotation reveal effect
- Subtitle: Fade in from bottom
- Description: Subtle fade in

**Usage**:
```tsx
<AnimatedHero
  title="JEMSO DRIVE"
  subtitle="Радость в движении!"
  description="Joy in Motion!"
/>
```

#### AnimatedCardGrid
**Component**: `src/components/animated-card-grid.tsx`

Grid of blog post cards with staggered entrance and hover animations.

**Props**:
```typescript
{
  posts: BlogPost[];     // Array of blog posts
  showTags?: boolean;    // Show tags on cards
}
```

**Animations**:
- Staggered fade-in and scale on mount
- Lift and scale on hover
- Smooth image scale on card hover

**Usage**:
```tsx
<AnimatedCardGrid posts={posts} showTags={true} />
```

#### AnimatedSectionHeader
**Component**: `src/components/animated-section-header.tsx`

Section header with slide-in animation.

**Props**:
```typescript
{
  title: string;          // Section title
  linkText?: string;      // Optional link text
  linkHref?: string;      // Optional link URL
}
```

**Usage**:
```tsx
<AnimatedSectionHeader
  title="Latest News"
  linkText="View All"
  linkHref="/blog"
/>
```

#### AnimatedCategoryTags
**Component**: `src/components/animated-category-tags.tsx`

Category filter tags with bounce-in animations.

**Props**:
```typescript
{
  categories: Category[];        // Array of categories
  currentCategory?: string;      // Currently selected category
}
```

**Animations**:
- Back-ease bounce on entrance
- Scale and lift on hover

#### AnimatedHeaderWrapper
**Component**: `src/components/animated-header.tsx`

Smart header that shows/hides on scroll.

**Features**:
- Hides when scrolling down (after 100px)
- Shows when scrolling up
- Initial fade-in animation
- Smooth GSAP transitions

#### AnimatedFooterWrapper
**Component**: `src/components/animated-footer.tsx`

Footer with staggered entrance animation when scrolled into view.

### 3. Scroll-Triggered Animations

#### ScrollReveal
**Component**: `src/components/scroll-reveal.tsx`

Generic wrapper component for scroll-triggered animations.

**Props**:
```typescript
{
  children: ReactNode;
  animation?: "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn" | "blurIn";
  delay?: number;          // Delay in seconds
  threshold?: number;      // Intersection observer threshold (0-1)
  className?: string;
}
```

**Usage**:
```tsx
<ScrollReveal animation="fadeIn" delay={0.2}>
  <YourContent />
</ScrollReveal>
```

### 4. GSAP Utilities

#### Animation Functions
**File**: `src/lib/gsap-utils.ts`

Reusable animation functions:

- `fadeIn(element, delay)` - Fade in from bottom
- `slideInLeft(element, delay)` - Slide in from left
- `slideInRight(element, delay)` - Slide in from right
- `scaleIn(element, delay)` - Scale up entrance
- `staggerChildren(container, childSelector, delay)` - Stagger child animations
- `floatingAnimation(element)` - Infinite floating effect
- `pulseAnimation(element)` - Infinite pulse effect
- `cardHoverIn(element)` - Card hover entrance
- `cardHoverOut(element)` - Card hover exit
- `textReveal(element, delay)` - 3D text reveal
- `blurIn(element, delay)` - Blur in effect
- `shimmerEffect(element)` - Shimmer animation

**Usage**:
```typescript
import { fadeIn, scaleIn } from "~/lib/gsap-utils";

// In a client component
useEffect(() => {
  if (elementRef.current) {
    fadeIn(elementRef.current, 0.2);
  }
}, []);
```

#### React Hooks
**File**: `src/lib/use-gsap.ts`

Custom hooks for common animations:

- `useFadeIn(delay)` - Returns ref with fade-in animation
- `useSlideInLeft(delay)` - Returns ref with slide-in-left animation
- `useSlideInRight(delay)` - Returns ref with slide-in-right animation
- `useScaleIn(delay)` - Returns ref with scale-in animation
- `useStaggerChildren(childSelector, delay)` - Returns ref with stagger animation
- `useFloating()` - Returns ref with floating animation
- `useBlurIn(delay)` - Returns ref with blur-in animation
- `useScrollAnimation(animationType)` - Returns ref with scroll-triggered animation

**Usage**:
```tsx
"use client";

import { useFadeIn } from "~/lib/use-gsap";

export function MyComponent() {
  const ref = useFadeIn(0.3);
  
  return <div ref={ref}>Content</div>;
}
```

### 5. CSS Animations

**File**: `src/styles/animations.css`

Additional CSS-based animations:

- `.hover-lift` - Lift effect on hover
- `.animated-gradient` - Animated gradient background
- `.shimmer` - Shimmer effect
- Smooth scroll behavior
- Performance optimizations
- Respects `prefers-reduced-motion`

## 🎯 Animation Best Practices

### Performance

1. **Use `will-change` sparingly**:
   ```tsx
   <div className="will-animate">...</div>
   ```

2. **Batch animations**:
   ```typescript
   const tl = gsap.timeline();
   tl.from(element1, {...})
     .from(element2, {...}, "-=0.3")
     .from(element3, {...}, "-=0.2");
   ```

3. **Clean up animations**:
   ```typescript
   useEffect(() => {
     const animation = gsap.to(element, {...});
     return () => animation.kill();
   }, []);
   ```

### Accessibility

- All animations respect `prefers-reduced-motion`
- Intersection Observer used for scroll animations (no performance impact)
- Animations are enhancement, not requirement for functionality

### Client vs Server Components

- All GSAP animations must be in client components (`"use client"`)
- Server components should import and use client animation components
- Keep animation logic separate from data fetching

## 🎨 Animation Timing Reference

```typescript
// Standard durations
quick: 0.2s
normal: 0.4s
slow: 0.6s
verySlow: 1s

// Standard eases
default: "power3.out"
bounce: "back.out(1.7)"
smooth: "sine.inOut"
sharp: "power2.out"

// Standard delays
stagger: 0.1s
sequence: 0.3s
```

## 📝 Examples

### Example 1: Animated Page
```tsx
// app/example/page.tsx
import { AnimatedHero } from "~/components/animated-hero";
import { AnimatedCardGrid } from "~/components/animated-card-grid";

export default async function ExamplePage() {
  const posts = await fetchPosts();
  
  return (
    <main>
      <AnimatedHero
        title="EXAMPLE"
        subtitle="Beautiful animations"
      />
      <section className="py-16">
        <AnimatedCardGrid posts={posts} />
      </section>
    </main>
  );
}
```

### Example 2: Custom Animation Hook
```tsx
// components/custom-component.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function CustomComponent() {
  const ref = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.from(ref.current, {
      opacity: 0,
      x: -50,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);
  
  return <div ref={ref}>Content</div>;
}
```

### Example 3: Scroll-Triggered Section
```tsx
// components/feature-section.tsx
"use client";

import { ScrollReveal } from "~/components/scroll-reveal";

export function FeatureSection() {
  return (
    <section className="py-16">
      <ScrollReveal animation="fadeIn">
        <h2>Features</h2>
      </ScrollReveal>
      
      <div className="grid grid-cols-3 gap-8">
        <ScrollReveal animation="scaleIn" delay={0.1}>
          <FeatureCard />
        </ScrollReveal>
        <ScrollReveal animation="scaleIn" delay={0.2}>
          <FeatureCard />
        </ScrollReveal>
        <ScrollReveal animation="scaleIn" delay={0.3}>
          <FeatureCard />
        </ScrollReveal>
      </div>
    </section>
  );
}
```

## 🔧 Troubleshooting

### Animation not working

1. Ensure component has `"use client"` directive
2. Check that ref is properly attached to element
3. Verify element exists when animation runs
4. Check browser console for errors

### Performance issues

1. Reduce number of simultaneous animations
2. Use CSS transforms instead of position properties
3. Add `will-change` to animated elements
4. Consider using `requestAnimationFrame` for complex animations

### Flickering animations

1. Add `backface-visibility: hidden` to element
2. Use `transform` instead of position properties
3. Ensure proper z-index layering
4. Check for conflicting CSS transitions

## 📚 Resources

- [GSAP Documentation](https://gsap.com/docs/v3/)
- [GSAP React Guide](https://gsap.com/resources/React/)
- [GSAP Easing Visualizer](https://gsap.com/docs/v3/Eases)
- [Animation Best Practices](https://web.dev/animations/)

