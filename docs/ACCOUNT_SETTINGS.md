# Account Settings Page Documentation

## Overview

A comprehensive personal account management page with multiple settings sections for profile, security, notifications, and subscription management.

## Features

### ✅ Profile Settings
- **Avatar management** with URL input (upload placeholder)
- **Name and email editing** with validation
- **Email verification status** display
- **Account information** (creation date, roles)
- Real-time updates with optimistic UI

### ✅ Security Settings
- **Password change** with current password verification
  - Password strength requirements
  - Confirmation matching
  - Success notification
- **Account deletion** with confirmation
  - Password verification required
  - Type "DELETE" to confirm
  - Irreversible action warning
  - Auto sign-out after deletion

### ✅ Notification Preferences
- **Email notifications** toggle
- **Security alerts** toggle (recommended)
- **Marketing emails** toggle
- **Newsletter subscription** toggle
  - Integrates with newsletter system
  - Updates `NewsletterSubscriber` table

### ✅ Subscription Management
- **Current plan display** with status badges
- **Subscription details**:
  - Start/end dates
  - Trial period information
  - Auto-renew status
- **Plan features** list
- **Available plans** grid with upgrade options
- **Billing management** (placeholder)

## Routes

### Main Route
**Path:** `/account`

**Protection:** Requires authentication (redirects to `/auth/sign-in` if not logged in)

**Layout:** Responsive tabs for mobile and desktop

## API Endpoints

### User Router (`api.user`)

#### Get Current User
```typescript
const user = await api.user.me.useQuery();
```

**Returns:**
```typescript
{
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  roles: Array<{
    id: string;
    name: string;
    slug: string;
    expiresAt: Date | null;
  }>;
  subscription: {
    id: string;
    status: string;
    planName: string;
    planSlug: string;
    startDate: Date;
    endDate: Date | null;
    trialEndsAt: Date | null;
    autoRenew: boolean;
    features: Array<{
      name: string;
      slug: string;
      type: string;
      value: string | null;
    }>;
  } | null;
}
```

#### Update Profile
```typescript
api.user.updateProfile.useMutation({
  name: "New Name",
  email: "new@email.com",
  image: "https://example.com/avatar.jpg"
});
```

**Validation:**
- Email uniqueness check
- Name min 2 characters
- Image must be valid URL

#### Change Password
```typescript
api.user.changePassword.useMutation({
  currentPassword: "OldPass123",
  newPassword: "NewPass123"
});
```

**Requirements:**
- Current password verification
- Min 8 characters
- Uppercase, lowercase, and number required
- Confirmation matching (handled client-side)

#### Get Preferences
```typescript
const preferences = await api.user.getPreferences.useQuery();
```

**Returns:**
```typescript
{
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  newsletterSubscribed: boolean;
}
```

#### Update Preferences
```typescript
api.user.updatePreferences.useMutation({
  emailNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  newsletterSubscribed: true
});
```

**Side Effects:**
- Newsletter subscription: Creates/updates `NewsletterSubscriber` record
- Other preferences: Stored in memory (can be persisted in `UserPreferences` table later)

#### Delete Account
```typescript
api.user.deleteAccount.useMutation({
  password: "MyPassword123"
});
```

**Behavior:**
- Verifies password
- Cascade deletes all related data:
  - Blog posts
  - Comments
  - User roles
  - Subscriptions
  - Password reset tokens
- Signs out user
- Redirects to homepage

## Component Structure

```
/app/account/
├── page.tsx                          # Main server component
└── _components/
    ├── account-tabs.tsx              # Tab navigation (client)
    ├── profile-settings.tsx          # Profile section (client)
    ├── security-settings.tsx         # Security section (client)
    ├── notification-settings.tsx     # Notifications section (client)
    └── subscription-settings.tsx     # Subscription section (client)
```

## UI Components Used

All components from shadcn/ui:
- **Tabs** - Main navigation
- **Card** - Section containers
- **Input** - Text fields
- **Label** - Form labels
- **Button** - Actions
- **Switch** - Toggle controls
- **Badge** - Status indicators
- **Avatar** - Profile pictures
- **Alert** - Success/error messages
- **Separator** - Visual dividers

## Responsive Design

### Mobile (< 640px)
- 2-column tab layout (Profile/Security, Notifications/Subscription)
- Icon-only tab labels
- Stacked form fields
- Full-width buttons

### Tablet (640px - 1024px)
- 2-column tab layout
- Icon + text labels
- Improved spacing

### Desktop (> 1024px)
- 4-column tab layout
- Full labels with icons
- Side-by-side layouts
- Optimal spacing

## Security Features

### Authentication
- Protected route (server-side check)
- Session-based authentication
- Auto-redirect if not logged in

### Password Management
- Current password required for changes
- Strong password requirements
- Bcrypt hashing (12 rounds)

### Account Deletion
- Password verification
- Explicit confirmation ("DELETE" typing)
- Warning messages
- Irreversible action safeguards

### Data Privacy
- Email uniqueness validation
- No password enumeration
- Cascade deletion of personal data

## State Management

### Form State
- Local React state for inputs
- Change tracking for save button enablement
- Reset functionality to revert changes

### API State (tRPC)
- Optimistic updates for better UX
- Loading states during mutations
- Error handling with user-friendly messages
- Success notifications

### Session State
- NextAuth session for user identity
- Auto-refresh on profile updates
- Sign-out on account deletion

## Future Enhancements

### Profile Section
- [ ] Image upload (file picker)
- [ ] Crop/resize avatar
- [ ] Remove avatar option
- [ ] Email verification flow

### Security Section
- [ ] Two-factor authentication
- [ ] Active sessions management
- [ ] Login history
- [ ] Security log

### Notifications Section
- [ ] Persist preferences to database (UserPreferences table)
- [ ] Notification channels (email, SMS, push)
- [ ] Frequency control (instant, daily, weekly)
- [ ] Category-specific preferences

### Subscription Section
- [ ] Payment method management
- [ ] Billing history
- [ ] Invoice download
- [ ] Plan comparison modal
- [ ] Upgrade/downgrade flow
- [ ] Cancel subscription with reasons
- [ ] Reactivate subscription

### General Enhancements
- [ ] Activity log
- [ ] Connected accounts (OAuth)
- [ ] API keys management
- [ ] Export personal data
- [ ] Privacy settings
- [ ] Language/timezone preferences

## Testing

### Manual Testing Steps

1. **Profile Settings**
   ```
   - Navigate to /account
   - Update name and email
   - Save changes
   - Verify updates persist
   - Test email uniqueness validation
   - Test avatar URL validation
   ```

2. **Security Settings**
   ```
   - Change password with correct current password
   - Try with incorrect current password
   - Verify password requirements
   - Test password mismatch
   - Test account deletion flow
   - Verify sign-out after deletion
   ```

3. **Notifications**
   ```
   - Toggle each preference
   - Save changes
   - Reload page to verify persistence
   - Check newsletter subscription status
   ```

4. **Subscription**
   ```
   - View current plan (if any)
   - Check subscription details
   - View available plans
   - Verify feature display
   ```

## Error Handling

### Common Errors

#### Profile Update
- **CONFLICT**: Email already in use
- **BAD_REQUEST**: Invalid input data
- **UNAUTHORIZED**: Not authenticated

#### Password Change
- **UNAUTHORIZED**: Current password incorrect
- **BAD_REQUEST**: OAuth accounts without password

#### Account Deletion
- **UNAUTHORIZED**: Password incorrect
- **NOT_FOUND**: User not found

### User Feedback

All errors display with:
- Clear error message
- Red alert component
- Icon for visual clarity
- Dismiss capability

Success messages show:
- Green success alert
- Confirmation message
- Auto-dismiss (or manual)

## Related Documentation

- [Authentication System](./AUTHENTICATION.md)
- [RBAC and Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)
- [Database Integration](./DATABASE_INTEGRATION.md)

## Usage Example

```typescript
// In any page or component
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function MyPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/sign-in");
  }
  
  return (
    <div>
      <Link href="/account">Account Settings</Link>
    </div>
  );
}
```

## Notes

- All mutations are protected (require authentication)
- Password changes require current password
- Account deletion is irreversible
- Newsletter subscription integrates with existing `NewsletterSubscriber` table
- Other notification preferences can be persisted by creating a `UserPreferences` table
- Subscription management is view-only (actual billing integration needed)

