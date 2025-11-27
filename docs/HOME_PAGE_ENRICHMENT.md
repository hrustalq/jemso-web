# Home Page Enrichment Documentation

## Overview

The main page has been enriched with multiple content sections, each featuring beautiful GSAP animations that enhance user experience and engagement.

## New Sections Added

### 1. Hero Section (Existing - Enhanced)
- **Component**: `AnimatedHero`
- **Content**: "JEMSO DRIVE - Радость в движении!"
- **Animation**: 3D rotation reveal effect

### 2. Call-to-Action Section (NEW)
- **Component**: `AnimatedCTASection`
- **Location**: Top of page (after hero)
- **Features**:
  - Floating badge with sparkles
  - Gradient text effects
  - Shimmer animation overlay
  - Sign up and Sign in buttons
  - Responsive design
- **Animations**:
  - Sequential timeline animation for badge, title, description, and buttons
  - Continuous floating effect on badge
  - Repeating shimmer effect
  - Scroll-triggered entrance

### 3. Categories Section (NEW)
- **Component**: `AnimatedCategoryCard`
- **Data Source**: `api.blog.categories.list({ featured: true })`
- **Features**:
  - Grid layout (responsive: 1-4 columns)
  - Category icons with custom colors
  - Post and event counts
  - Border top accent in category color
  - Hover overlay effect
- **Animations**:
  - Scale-in with bounce effect (back.out easing)
  - Staggered entrance (0.1s delay between cards)
  - Scale-up on hover
  - Scroll-triggered
- **Link**: `/categories` page

### 4. Events Section (NEW)
- **Component**: `AnimatedEventCard`
- **Data Source**: `api.event.events.list({ upcoming: true })`
- **Features**:
  - Grid layout (responsive: 1-3 columns)
  - Event cover images
  - Category badges
  - Date, location, and attendee information
  - Progress indicator for registrations
- **Animations**:
  - Fade-in and slide-up from bottom
  - Staggered entrance (0.15s delay)
  - Lift effect on hover
  - Image scale on hover
  - Scroll-triggered
- **Link**: `/events` page

### 5. News Section (Enhanced)
- **Component**: `AnimatedCardGrid` (existing)
- **Data Source**: `api.blog.posts.list({ published: true })`
- **Features**: 
  - Latest 6 blog posts
  - Enhanced with ScrollReveal wrapper
- **Link**: `/blog` page

### 6. Subscription Plans Section (NEW)
- **Component**: `AnimatedPlanCard`
- **Data Source**: `api.subscriptions.plans.list({ isActive: true })`
- **Features**:
  - Grid layout (responsive: 1-3 columns)
  - Popular plan highlighting
  - Price formatting with currency
  - Feature list with checkmarks
  - Trial period display
  - Background decoration for popular plans
- **Animations**:
  - Fade-in and slide-up with larger distance
  - Staggered entrance (0.2s delay)
  - Lift with shadow on hover
  - Scroll-triggered
- **Description**: 
  - Explains subscription benefits
  - Premium content access
  - Exclusive events
  - Shop discounts

### 7. Shop Preview Section (NEW)
- **Component**: `AnimatedShopPreview`
- **Features**:
  - Three feature cards:
    - Original products
    - Fast delivery
    - Quality guarantee
  - Large CTA card with gradient background
  - Multiple action buttons
- **Animations**:
  - Slide-in from left
  - Staggered entrance (0.15s delay)
  - Icon color change on hover
  - Scroll-triggered
- **Link**: `/shop` page

### 8. Final CTA Section (NEW)
- **Component**: Simple card with gradient
- **Features**:
  - Minimalist design
  - Reinforcement of main CTA
  - Scale-in animation

## New Components Created

### 1. AnimatedEventCard (`/components/animated-event-card.tsx`)
**Purpose**: Display events in an animated grid

**Props**:
```typescript
{
  events: Event[]
}
```

**Key Features**:
- Date formatting (Russian locale)
- Location display
- Registration progress
- Category badge with custom colors
- Cover image with gradient overlay

**Animations**:
- GSAP ScrollTrigger for entrance
- Staggered opacity and y-position
- Hover lift effect

### 2. AnimatedCategoryCard (`/components/animated-category-card.tsx`)
**Purpose**: Display categories in an animated grid

**Props**:
```typescript
{
  categories: Category[]
}
```

**Key Features**:
- Custom icon and color support
- Post and event counts
- Color-coded top border
- Hover overlay with category color

**Animations**:
- Back-ease bounce entrance
- Scale animation on mount
- Scale-up on hover

### 3. AnimatedPlanCard (`/components/animated-plan-card.tsx`)
**Purpose**: Display subscription plans in an animated grid

**Props**:
```typescript
{
  plans: Plan[]
}
```

**Key Features**:
- Price formatting with Intl API
- Billing interval display
- Trial period indicator
- Feature list with icons
- Popular badge
- Background decoration for popular plans

**Animations**:
- Large slide-up entrance
- Extended stagger delay
- Lift with dynamic shadow on hover

### 4. AnimatedShopPreview (`/components/animated-shop-preview.tsx`)
**Purpose**: Showcase shop features and CTA

**Features**:
- Feature cards with icons
- Large gradient CTA card
- Multiple action buttons

**Animations**:
- Slide-in from left
- Icon transition on hover

### 5. AnimatedCTASection (`/components/animated-cta-section.tsx`)
**Purpose**: Main call-to-action for registration

**Features**:
- Floating badge
- Gradient text
- Shimmer effect
- Background pattern
- Decorative blur elements

**Animations**:
- Sequential timeline
- Floating badge (infinite)
- Shimmer effect (infinite)
- Scroll-triggered entrance

## New Pages Created

### 1. Events Page (`/app/(public)/events/page.tsx`)
**Route**: `/events`

**Features**:
- Lists all events
- Separates upcoming and past events
- Server-side rendering
- ScrollReveal animations

### 2. Categories Page (`/app/(public)/categories/page.tsx`)
**Route**: `/categories`

**Features**:
- Lists all categories
- Server-side rendering
- ScrollReveal animations

## Data Fetching Strategy

### Parallel Fetching
Used `Promise.all` to fetch all data simultaneously for optimal performance:

```typescript
const [latestPosts, upcomingEvents, categories, plans] = await Promise.all([
  api.blog.posts.list({ ... }),
  api.event.events.list({ ... }),
  api.blog.categories.list({ ... }),
  api.subscriptions.plans.list({ ... }),
]);
```

**Benefits**:
- Reduces waterfall requests
- Minimizes page load time
- Server-side rendering maintained

## Animation Patterns Used

### 1. ScrollTrigger Pattern
```typescript
gsap.from(cards, {
  opacity: 0,
  y: 50,
  duration: 0.6,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: cardsRef.current,
    start: "top bottom-=100",
    toggleActions: "play none none none",
  },
});
```

### 2. Hover Animation Pattern
```typescript
element.addEventListener("mouseenter", () => {
  gsap.to(element, {
    y: -8,
    duration: 0.3,
    ease: "power2.out",
  });
});

element.addEventListener("mouseleave", () => {
  gsap.to(element, {
    y: 0,
    duration: 0.3,
    ease: "power2.out",
  });
});
```

### 3. Timeline Pattern (for sequential animations)
```typescript
const timeline = gsap.timeline({
  scrollTrigger: { ... }
});

timeline
  .from(".element1", { ... })
  .from(".element2", { ... }, "-=0.2")
  .from(".element3", { ... }, "-=0.3");
```

### 4. Infinite Animation Pattern
```typescript
gsap.to(".element", {
  y: -10,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
```

## Design System Integration

### Color Palette
- **Primary**: `oklch(0.60 0.24 25)` - Red accent
- **Card Background**: `bg-card/50` with `backdrop-blur`
- **Border**: `border-border/40`
- **Text**: Follows theme color system

### Spacing
- **Section padding**: `py-16` (4rem vertical)
- **Container**: `container mx-auto px-4`
- **Card gaps**: `gap-6` or `gap-8`

### Typography
- **Page titles**: `text-4xl md:text-5xl font-bold`
- **Section titles**: `text-3xl md:text-4xl font-bold`
- **Card titles**: `text-xl` or `text-2xl font-bold`
- **Descriptions**: `text-muted-foreground`

### Responsive Design
- **Mobile**: Single column, stacked layout
- **Tablet**: 2 columns for most grids
- **Desktop**: 3-4 columns depending on content

## Performance Considerations

### 1. Server-Side Rendering
- All data fetching happens on the server
- No client-side loading states for main content
- Faster initial page load

### 2. Parallel Data Fetching
- Reduced total fetch time
- All API calls happen simultaneously

### 3. GSAP ScrollTrigger
- Animations only play when elements are in view
- No unnecessary animations
- Respects `prefers-reduced-motion`

### 4. Lazy Loading
- Client components only load when needed
- Server components render first

### 5. Decimal Conversion
- Prisma Decimal types converted to numbers
- Prevents serialization errors
- Done at server level before passing to client

## Browser Support

### GSAP
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers

### ScrollTrigger
- IntersectionObserver fallback available
- Works on all modern browsers

### CSS
- Tailwind CSS with fallbacks
- backdrop-blur with fallbacks

## Future Enhancements

### Potential Additions
1. **Testimonials Section**: Customer reviews with carousel
2. **Partners Section**: Logo grid of sponsors/partners
3. **Stats Section**: Animated counters for key metrics
4. **Gallery Section**: Photo/video gallery from events
5. **FAQ Section**: Accordion with common questions
6. **Newsletter Section**: Email subscription form

### Animation Enhancements
1. **Parallax Effects**: Background elements with parallax
2. **Magnetic Buttons**: Cursor-following button effects
3. **Text Scramble**: Text reveal with scramble effect
4. **Particle Effects**: Floating particles in hero section
5. **Scroll Progress**: Progress bar at top of page

### Performance Optimizations
1. **Image Optimization**: Next.js Image component
2. **Lazy Loading**: Images and heavy components
3. **Code Splitting**: Dynamic imports for animations
4. **Caching**: API response caching
5. **Prefetching**: Link prefetching for better navigation

## Testing Checklist

- [x] All sections render correctly
- [x] Animations play on scroll
- [x] Hover effects work
- [x] Links navigate correctly
- [x] Responsive design works on all breakpoints
- [x] No console errors
- [x] Decimal conversion prevents errors
- [x] Server-side rendering works
- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] Accessibility audit
- [ ] Cross-browser testing

## Related Documentation

- [GSAP Animations](./GSAP_ANIMATIONS.md)
- [App Structure](./APP_STRUCTURE.md)
- [Loading States](./LOADING_STATES.md)
- [RBAC and Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)

