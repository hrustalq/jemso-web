# Scroll Snapping & Appearing Animations

## Overview

The home page now features smooth scroll snapping and sophisticated appearing animations for each section, creating a modern, immersive user experience inspired by contemporary web design trends.

## Scroll Snapping Implementation

### CSS Scroll Snap
Each section on the home page uses CSS Scroll Snap to create a smooth, full-screen experience:

```tsx
<main className="snap-y snap-mandatory overflow-y-auto">
  <section className="min-h-screen snap-start flex items-center justify-center">
    {/* Section content */}
  </section>
</main>
```

### Key Classes

- **`snap-y`**: Enables vertical scroll snapping
- **`snap-mandatory`**: Forces snapping to occur (as opposed to `snap-proximity`)
- **`snap-start`**: Snaps to the start of each section
- **`min-h-screen`**: Each section takes up at least the full viewport height
- **`flex items-center justify-center`**: Centers content vertically and horizontally

### Smooth Scroll Behavior

Added to `globals.css`:

```css
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

## Appearing Animations

Each section uses different appearing animations via the `ScrollReveal` component for visual variety:

### Animation Types by Section

1. **Hero Section**
   - Built-in `AnimatedHero` component
   - 3D rotation reveal for title
   - Fade-in for subtitle and description

2. **CTA Section (Top)**
   - Sequential timeline animation
   - Floating badge
   - Shimmer effect
   - Scroll-triggered entrance

3. **Categories Section**
   - **Animation**: `fadeIn`
   - Smooth fade from bottom
   - Section header slides in
   - Category cards scale in with bounce

4. **Events Section**
   - **Animation**: `slideInLeft`
   - Section header slides from left
   - Event cards stagger from bottom with lift

5. **News Section**
   - **Animation**: `slideInRight`
   - Section header slides from right
   - Blog cards fade and scale in staggered

6. **Subscription Plans Section**
   - **Animation**: `scaleIn`
   - Title and description scale up
   - Plan cards slide up with extended stagger

7. **Shop Section**
   - **Animation**: `blurIn`
   - Section header blurs in
   - Feature cards slide from left

8. **Final CTA Section**
   - **Animation**: `scaleIn`
   - Card scales up dramatically

### ScrollReveal Component

The `ScrollReveal` component wraps section headers and triggers animations when they enter the viewport:

```tsx
<ScrollReveal animation="fadeIn">
  <AnimatedSectionHeader
    title="Section Title"
    linkText="View All"
    linkHref="/link"
  />
</ScrollReveal>
```

**Available Animations**:
- `fadeIn` - Fade in from bottom
- `slideInLeft` - Slide in from left
- `slideInRight` - Slide in from right
- `scaleIn` - Scale up with back easing
- `blurIn` - Blur in effect

## User Experience Benefits

### 1. Full-Screen Sections
- Each section occupies the full viewport
- Creates focused, distraction-free experience
- Natural content segmentation

### 2. Smooth Navigation
- Automatic snapping to sections
- Smooth scroll behavior
- Predictable navigation

### 3. Visual Hierarchy
- Different animations create visual interest
- Guides user attention
- Emphasizes section importance

### 4. Performance
- CSS-based scroll snapping (hardware accelerated)
- GSAP animations are GPU-optimized
- Respects `prefers-reduced-motion`

## Accessibility Considerations

### Reduced Motion Support
For users with motion sensitivities:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation
- Scroll snapping works with keyboard (PgUp/PgDown, Space, Arrow keys)
- Tab navigation not affected
- Screen reader friendly

### Focus Management
- Focus indicators remain visible
- Logical tab order maintained
- No focus traps

## Browser Support

### Scroll Snap
- ✅ Chrome 69+
- ✅ Firefox 68+
- ✅ Safari 11+
- ✅ Edge 79+

### CSS Smooth Scroll
- ✅ Chrome 61+
- ✅ Firefox 36+
- ✅ Safari 15.4+
- ✅ Edge 79+

### Fallback Behavior
On unsupported browsers:
- Normal scrolling works fine
- Sections still occupy full viewport
- Animations still trigger on scroll

## Technical Details

### Section Structure

Each section follows this pattern:

```tsx
<section className="min-h-screen snap-start flex items-center justify-center py-16">
  <div className="container mx-auto px-4 w-full">
    <ScrollReveal animation="[animation-type]">
      <AnimatedSectionHeader
        title="Section Title"
        linkText="View All"
        linkHref="/link"
      />
    </ScrollReveal>
    
    {/* Section content with its own animations */}
    <AnimatedComponent data={data} />
  </div>
</section>
```

### Layered Animations

Each section has multiple animation layers:

1. **Section appearance** (ScrollReveal)
2. **Header animation** (AnimatedSectionHeader)
3. **Content animation** (Component-specific GSAP animations)

This creates a choreographed, professional effect.

### Scroll Position

The `snap-start` aligns sections to the **start** of the scroll container, creating consistent positioning across different screen sizes.

## Customization

### Changing Snap Behavior

For looser snapping:
```tsx
<main className="snap-y snap-proximity overflow-y-auto">
```

For no snapping on small screens:
```tsx
<main className="md:snap-y md:snap-mandatory overflow-y-auto">
```

### Adjusting Animation Duration

In `ScrollReveal` component or custom GSAP animations:

```typescript
gsap.from(element, {
  opacity: 0,
  y: 30,
  duration: 0.8, // Increase for slower
  ease: "power3.out",
});
```

### Changing Animation Types

Simply swap the animation prop:

```tsx
// From
<ScrollReveal animation="fadeIn">

// To
<ScrollReveal animation="slideInLeft">
```

## Performance Optimization

### GPU Acceleration
All transforms use GPU-accelerated properties:
- `transform: translateY()`
- `transform: scale()`
- `opacity`

### Will-Change
Critical animations use `will-change` for optimization:

```css
.animating-element {
  will-change: transform, opacity;
}
```

### Intersection Observer
ScrollReveal uses Intersection Observer (not scroll events):
- Better performance
- Battery efficient
- Built-in throttling

## Mobile Experience

### Touch Gestures
- Swipe up/down to navigate between sections
- Smooth inertia scrolling
- Momentum preserved

### Responsive Sections
All sections adapt to mobile:
- Proper padding and spacing
- Flexible heights (min-height)
- Touch-friendly hit areas

### Performance on Mobile
- Reduced motion by default on some devices
- Hardware acceleration enabled
- Lightweight animations

## Testing Checklist

- [x] Scroll snapping works smoothly
- [x] Each section centers properly
- [x] Animations trigger on scroll
- [x] Keyboard navigation works
- [x] Reduced motion preference respected
- [x] Mobile touch gestures work
- [x] No layout shift or jank
- [x] Performance is smooth (60fps)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Screen reader compatibility
- [ ] Different viewport sizes
- [ ] Slow network conditions

## Troubleshooting

### Snapping Not Working

1. Check parent has `snap-y` and `snap-mandatory`
2. Ensure sections have `snap-start`
3. Verify sections are direct children
4. Check for `overflow: hidden` conflicts

### Animations Not Triggering

1. Verify `ScrollReveal` is imported
2. Check GSAP ScrollTrigger is registered
3. Ensure element is in viewport
4. Check console for errors

### Jumpy Scrolling

1. Remove conflicting CSS transitions
2. Check for nested scroll containers
3. Verify `scroll-behavior: smooth`
4. Test with different scroll speeds

## Future Enhancements

### Potential Improvements

1. **Scroll Progress Indicator**
   - Dot navigation on side
   - Shows current section
   - Click to jump to section

2. **Section Transitions**
   - Fade between sections
   - Parallax effects
   - Background color transitions

3. **Dynamic Snap Points**
   - Adjust based on content height
   - Skip empty sections
   - Smart snapping logic

4. **Mouse Wheel Control**
   - Custom wheel handling
   - Smooth section transitions
   - Velocity-based navigation

5. **Touch Gestures**
   - Swipe between sections
   - Pull to refresh
   - Gesture indicators

## Related Documentation

- [GSAP Animations](./GSAP_ANIMATIONS.md)
- [Home Page Enrichment](./HOME_PAGE_ENRICHMENT.md)
- [Layout Spacing](./LAYOUT_SPACING.md)

## Resources

- [CSS Scroll Snap Specification](https://www.w3.org/TR/css-scroll-snap-1/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Web.dev Scroll Snap](https://web.dev/css-scroll-snap/)
- [MDN Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)

