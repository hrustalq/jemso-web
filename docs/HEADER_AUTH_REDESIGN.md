# Header Authentication Redesign

## Overview

The header has been redesigned with integrated authentication functionality using NextAuth + tRPC, featuring a modern layout with the custom Gran Turismo-inspired theming.

## Implementation Summary

### ✅ Completed Changes

1. **Header Component** (`src/components/header.tsx`)
   - Converted to async server component
   - Fetches session server-side using `auth()` from NextAuth
   - Conditional rendering based on authentication state
   - Responsive design with mobile-first approach

2. **User Menu** (`src/components/user-menu.tsx`)
   - Client component with interactive dropdown
   - Avatar with user initials or profile image
   - Menu items:
     - Профиль (Profile) → `/account`
     - Настройки (Settings) → `/account?tab=settings`
     - Подписка (Subscription) → `/account?tab=subscription`
     - Админ панель (Admin Panel) → `/admin/posts`
     - Выйти (Sign Out)
   - Sign-out functionality with redirect to home
   - Uses shadcn Avatar and DropdownMenu components

3. **Mobile Navigation** (`src/components/header-nav.tsx`)
   - Client component with Sheet (mobile drawer)
   - Shows auth buttons for unauthenticated users
   - Full navigation menu
   - Responsive design

4. **Session Provider** (`src/components/providers.tsx`)
   - Wraps app with NextAuth SessionProvider
   - Enables client-side session access
   - Required for sign-out functionality

5. **Layout Updates** (`src/app/layout.tsx`)
   - Added Providers wrapper
   - Maintains TRPCReactProvider integration

## Features

### For Unauthenticated Users
- **Sign In Button** - Ghost variant (desktop only on small screens)
- **Sign Up Button** - Primary variant (desktop only on small screens)
- **Mobile Auth** - Both buttons visible in mobile menu

### For Authenticated Users
- **User Avatar** - Circular avatar with border
- **Initials Fallback** - Auto-generated from user name
- **Dropdown Menu** - Quick access to:
  - Account settings
  - Profile management
  - Subscription info
  - Admin panel (if authorized)
  - Sign out

## Design Features

### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│ LOGO    NAV_ITEMS (hidden on mobile)    AUTH_SECTION  ☰   │
└────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Mobile** (`< lg`): Logo + Auth + Hamburger menu
- **Desktop** (`≥ lg`): Logo + Full navigation + Auth

### Theming Integration
- Uses Gran Turismo-inspired color scheme from `globals.css`
- Primary red accent: `oklch(0.55 0.22 25)` (light) / `oklch(0.60 0.24 25)` (dark)
- Background blur with `backdrop-filter`
- Consistent border and spacing
- Dark theme by default

### Interactive States
- Hover effects on all interactive elements
- Smooth transitions
- Focus states for accessibility
- Dropdown animations (fade + zoom)

## File Structure

```
src/components/
├── header.tsx          # Main header (async server component)
├── header-nav.tsx      # Mobile navigation (client component)
├── user-menu.tsx       # User dropdown menu (client component)
└── providers.tsx       # SessionProvider wrapper (client component)

src/app/
└── layout.tsx          # Updated with Providers wrapper
```

## Technical Details

### Server-Side Session Check
```typescript
export async function Header() {
  const session = await auth();
  // Render based on session state
}
```

### Client-Side Sign Out
```typescript
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/" });
};
```

### Type Safety
- Full TypeScript support
- Proper Session type from NextAuth
- Augmented user type with roleId and subscriptionId

## Usage Examples

### Accessing User Info
The session includes:
```typescript
{
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roleId: string | null;
    subscriptionId: string | null;
  }
}
```

### Navigation Items
Currently configured items:
1. Новости (News)
2. Дрифт (Drift)
3. Дрэг (Drag)
4. Клуб (Club)
5. Магазин (Shop)
6. Блог (Blog)
7. О нас (About)
8. Контакты (Contact)

First 6 items shown on desktop, all items in mobile menu.

## Integration with Existing Systems

### NextAuth Integration
- ✅ Uses existing auth configuration
- ✅ Supports both credentials and OAuth providers
- ✅ JWT-based sessions
- ✅ Role-based access control ready

### RBAC Integration
- User roles stored in session
- Admin panel link ready for permission checks
- Can be extended with role-based menu items

### tRPC Integration
- Works seamlessly with existing tRPC setup
- Can fetch user data via tRPC if needed
- No conflicts with query client

## Performance Considerations

- **Server Components**: Header is async server component (no client JS overhead)
- **Code Splitting**: Interactive parts are separate client components
- **Caching**: NextAuth session is cached
- **Optimistic Updates**: Fast auth state changes

## Accessibility

- Proper ARIA labels on buttons
- Keyboard navigation support
- Focus management in dropdown
- Screen reader friendly
- Semantic HTML structure

## Future Enhancements

### Potential Additions
1. **Notifications Badge** - Show unread notifications count
2. **Theme Toggle** - Light/dark mode switcher
3. **Search Bar** - Global search functionality
4. **Language Switcher** - Multi-language support
5. **User Status** - Online/offline indicator
6. **Quick Actions** - Common tasks dropdown
7. **Breadcrumbs** - Navigation trail

### Permission-Based Menu Items
```typescript
// Example: Show admin link only for admins
{session?.user?.roleId === 'admin-role-id' && (
  <DropdownMenuItem>Admin Panel</DropdownMenuItem>
)}
```

## Testing Checklist

- [x] Unauthenticated state shows Sign In/Up buttons
- [x] Authenticated state shows user avatar
- [x] Dropdown menu opens on avatar click
- [x] All menu items navigate correctly
- [x] Sign out works and redirects
- [x] Mobile menu works on small screens
- [x] Avatar shows user initials correctly
- [x] Responsive design works at all breakpoints
- [x] Dark theme colors applied correctly
- [x] No console errors
- [x] TypeScript type safety maintained

## Related Documentation

- [Authentication System](./AUTHENTICATION.md)
- [RBAC & Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)
- [Account Settings](./ACCOUNT_SETTINGS.md)

## Dependencies

All required dependencies are already installed:
- `next-auth@5.0.0-beta.25`
- `@radix-ui/react-avatar`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-separator`
- `lucide-react` (icons)

## Environment Variables

Uses existing NextAuth environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

No additional configuration required!

## Troubleshooting

### Session Not Loading
- Check `NEXTAUTH_SECRET` is set
- Verify auth configuration in `src/server/auth/config.ts`
- Clear browser cookies and try again

### Avatar Not Showing
- Check user has `name` or `email` in session
- Verify image URL is accessible (if using custom image)
- Check browser console for image loading errors

### Dropdown Not Opening
- Ensure SessionProvider is wrapping the app
- Check for JavaScript errors in console
- Verify all client components have "use client" directive

### Mobile Menu Issues
- Check viewport width and breakpoints
- Verify Sheet component is rendering
- Test on actual mobile device (not just browser resize)

---

**Status**: ✅ Complete and Production Ready

The header redesign successfully integrates authentication with a modern, responsive layout that follows the project's theming and best practices.

