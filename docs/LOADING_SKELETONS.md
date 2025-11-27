# Loading Skeletons Documentation

## Overview

Loading skeletons provide visual feedback while content is being fetched, preventing sections from appearing invisible or empty during data loading. This is especially important for scroll-snapped sections where an empty section can create a jarring user experience.

## Implementation Strategy

### Suspense Boundaries

We use React's `Suspense` to wrap async components that fetch data:

```tsx
<Suspense fallback={<SectionSkeleton />}>
  <AsyncSection />
</Suspense>
```

### Separate Section Components

Each major section that fetches data is split into:

1. **Async Section Component** - Fetches and renders data
2. **Skeleton Component** - Shows while loading
3. **Integration** - Main page wraps with Suspense

## Skeleton Components

### 1. CategorySkeleton (`/components/category-skeleton.tsx`)

**Purpose**: Loading state for category cards

**Features**:
- 4 card placeholders in grid layout
- Animated fade-in entrance
- Continuous pulse animation
- Matches category card structure

**Structure**:
```tsx
<Card>
  <Skeleton className="h-12 w-12" /> {/* Icon */}
  <Skeleton className="h-6 w-32" />  {/* Title */}
  <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
  <Skeleton className="h-4 w-3/4" /> {/* Description line 2 */}
  {/* Badges */}
</Card>
```

**Animations**:
- Staggered fade-in (0.1s delay)
- Continuous pulse (1.5s duration, infinite)
- Opacity oscillates between 1 and 0.7

### 2. EventSkeleton (`/components/event-skeleton.tsx`)

**Purpose**: Loading state for event cards

**Features**:
- 3 card placeholders in grid layout
- Cover image placeholder
- Content area with text lines
- Meta information placeholders

**Structure**:
```tsx
<Card>
  <Skeleton className="h-48" />     {/* Cover image */}
  <div className="p-6">
    <Skeleton className="h-6" />    {/* Title */}
    <Skeleton className="h-4" />    {/* Excerpt */}
    <Skeleton className="h-4" />    {/* Date/Location */}
  </div>
</Card>
```

**Animations**:
- Staggered fade-in (0.15s delay)
- Continuous pulse with offset timing
- Matches event card entrance animation

## Section Components

### CategoriesSection (`/app/(public)/_components/categories-section.tsx`)

**Server Component** that fetches categories:

```tsx
export async function CategoriesSection() {
  const categories = await api.blog.categories.list({
    featured: true,
  });

  if (categories.length === 0) {
    return null; // Don't show section if empty
  }

  return (
    <section className="min-h-screen snap-start">
      {/* Content */}
    </section>
  );
}
```

### CategoriesSectionSkeleton

**Wrapper** for skeleton with section structure:

```tsx
export function CategoriesSectionSkeleton() {
  return (
    <section className="min-h-screen snap-start">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-48" /> {/* Header */}
        <CategorySkeleton />
      </div>
    </section>
  );
}
```

### EventsSection & EventsSectionSkeleton

Same pattern as categories, but for events.

## Integration in Main Page

```tsx
export default async function Home() {
  // Only fetch non-suspensed data
  const [latestPosts, plans] = await Promise.all([
    api.blog.posts.list({ ... }),
    api.subscriptions.plans.list({ ... }),
  ]);

  return (
    <main>
      {/* Categories with Suspense */}
      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Events with Suspense */}
      <Suspense fallback={<EventsSectionSkeleton />}>
        <EventsSection />
      </Suspense>

      {/* Other sections that don't need suspense */}
    </main>
  );
}
```

## Benefits

### 1. Prevents Empty Sections
- Skeleton ensures section is always visible
- Maintains scroll snap behavior
- No jarring layout shifts

### 2. Progressive Loading
- Sections can load independently
- Faster initial render (show skeleton first)
- Better perceived performance

### 3. Visual Feedback
- User knows content is loading
- Animated pulse indicates activity
- Matches final content structure

### 4. Smooth Animations
- Skeleton fades in with animation
- Transitions to real content smoothly
- GSAP animations trigger on content load

## Animation Details

### Entrance Animation

```typescript
gsap.from(cards, {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.1,
  ease: "power2.out",
});
```

### Pulse Animation

```typescript
gsap.to(cards, {
  opacity: 0.7,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  stagger: {
    each: 0.2,
    repeat: -1,
    yoyo: true,
  },
});
```

## Best Practices

### 1. Match Content Structure
Skeleton should mirror the final content:
- Same number of elements
- Similar heights and widths
- Matching layout (grid, flex, etc.)

### 2. Use Semantic Colors
- Use theme colors (`bg-muted`, etc.)
- Respect dark/light mode
- Maintain contrast ratios

### 3. Consistent Timing
- Entrance: 0.4-0.5s
- Pulse: 1.5s cycle
- Stagger: 0.1-0.2s between items

### 4. Performance
- Keep animations lightweight
- Use CSS transforms when possible
- Cleanup animations on unmount

### 5. Accessibility
- Skeletons are decorative (no aria-labels needed)
- Content loads with proper semantics
- Animations respect `prefers-reduced-motion`

## Common Issues & Solutions

### Issue: Skeleton Flickers

**Problem**: Skeleton shows briefly then content appears

**Solution**: Add minimum loading time or streaming delay

```tsx
// In server component
await new Promise(resolve => setTimeout(resolve, 300));
```

### Issue: Layout Shift

**Problem**: Skeleton height doesn't match content

**Solution**: Use exact heights or min-heights

```tsx
<Skeleton className="h-48 w-full" /> // Match exact image height
```

### Issue: No Animation

**Problem**: Skeleton appears instantly without animation

**Solution**: Ensure GSAP is imported and useEffect runs

```tsx
import { gsap } from "gsap";
import { useEffect } from "react";
```

### Issue: Multiple Skeletons

**Problem**: Multiple skeletons show for the same section

**Solution**: Check Suspense boundary placement

```tsx
// Bad - Multiple boundaries
<Suspense fallback={<Skeleton />}>
  <Suspense fallback={<Skeleton />}>
    <Content />
  </Suspense>
</Suspense>

// Good - Single boundary
<Suspense fallback={<Skeleton />}>
  <Content />
</Suspense>
```

## When to Use Skeletons

### ✅ Use Skeletons For:
- Scroll-snapped sections
- Above-the-fold content
- Lists and grids
- Complex card layouts
- Slow-loading data

### ❌ Don't Use Skeletons For:
- Instant data (already cached)
- Below-the-fold content (lazy load)
- Simple text content
- Error states
- Empty states

## Alternative Loading Patterns

### 1. Spinner Loader
For small components or buttons:

```tsx
<SpinnerLoader />
```

### 2. Progressive Enhancement
Load basic content first, enhance later:

```tsx
<div suppressHydrationWarning>
  {isClient ? <FullContent /> : <BasicContent />}
</div>
```

### 3. Optimistic UI
Show content immediately, update after:

```tsx
<div>
  {optimisticData.map(...)}
  {/* Real data replaces seamlessly */}
</div>
```

## Testing

### Manual Testing
1. Enable slow 3G in DevTools
2. Clear cache
3. Reload page
4. Verify skeletons appear
5. Check animations are smooth
6. Confirm content replaces skeleton

### Automated Testing
```tsx
test('shows skeleton while loading', async () => {
  render(<AsyncSection />);
  expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
```

## Performance Metrics

### Target Metrics
- **Skeleton Render**: < 100ms
- **Animation Start**: < 50ms
- **Content Replace**: < 200ms
- **Total Loading**: < 2s (on 3G)

### Measuring Performance

```typescript
console.time('skeleton-render');
// ... skeleton code ...
console.timeEnd('skeleton-render');
```

## Future Enhancements

### Potential Improvements

1. **Smart Skeleton Sizing**
   - Calculate from previous renders
   - Store in localStorage
   - More accurate placeholders

2. **Content Hints**
   - Show partial data early
   - Progressive enhancement
   - Blur-in real images

3. **Skeleton Themes**
   - Different styles per section
   - Brand-specific animations
   - Seasonal variations

4. **Streaming Data**
   - Show items as they load
   - Remove skeleton progressively
   - Smoother transitions

## Related Documentation

- [Loading States](./LOADING_STATES.md)
- [GSAP Animations](./GSAP_ANIMATIONS.md)
- [Scroll Snapping](./SCROLL_SNAPPING_AND_ANIMATIONS.md)

## Resources

- [React Suspense](https://react.dev/reference/react/Suspense)
- [Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)
- [GSAP Documentation](https://gsap.com/docs/)

