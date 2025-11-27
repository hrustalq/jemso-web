# Authentication System Documentation

## Overview

The application now includes a complete authentication system with email/password credentials, password reset functionality, and integration with NextAuth.js.

## Features

- ✅ Sign up with email and password
- ✅ Sign in with credentials
- ✅ Password reset via email token
- ✅ Secure password hashing with bcrypt
- ✅ Token-based password reset (1-hour expiry)
- ✅ JWT session strategy for credentials
- ✅ Integration with existing RBAC system
- ✅ Auto-assign "user" role on registration
- ✅ Modern UI with shadcn components

## Database Schema Updates

### User Model
Added password field for credentials authentication:
```prisma
model User {
    // ... existing fields
    password      String?   // Hashed password for credentials provider
    passwordResetTokens PasswordResetToken[]
}
```

### PasswordResetToken Model
New model for managing password reset tokens:
```prisma
model PasswordResetToken {
    id        String   @id @default(cuid())
    token     String   @unique
    userId    String
    expires   DateTime
    used      Boolean  @default(false)
    createdAt DateTime @default(now())

    user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Routes

### Auth Router (`api.auth`)

#### Sign Up
```typescript
api.auth.signUp.mutate({
  email: "user@example.com",
  password: "SecurePass123",
  name: "John Doe" // optional
});
```

**Features:**
- Email validation
- Password strength requirements (min 8 chars, uppercase, lowercase, number)
- Automatic password hashing
- Auto-assign default "user" role
- Email verification (currently auto-verified)
- Welcome email (placeholder)

#### Sign In
```typescript
api.auth.signIn.mutate({
  email: "user@example.com",
  password: "SecurePass123"
});
```

**Features:**
- Validates credentials
- Returns user info on success
- Used internally by NextAuth

#### Forgot Password
```typescript
api.auth.forgotPassword.mutate({
  email: "user@example.com"
});
```

**Features:**
- Generates secure reset token
- Invalidates existing tokens
- 1-hour expiration
- Email sent with reset link (placeholder)
- No email enumeration (always returns success)

#### Verify Reset Token
```typescript
const { valid, email } = await api.auth.verifyResetToken.query({
  token: "reset-token-here"
});
```

**Features:**
- Checks token validity
- Verifies not expired
- Verifies not used
- Returns associated email

#### Reset Password
```typescript
api.auth.resetPassword.mutate({
  token: "reset-token-here",
  password: "NewSecurePass123"
});
```

**Features:**
- Validates token
- Enforces password requirements
- Hashes new password
- Marks token as used
- Updates user password

## Authentication Pages

### Sign In Page
**Route:** `/auth/sign-in`

**Features:**
- Email and password inputs
- "Forgot password?" link
- "Sign up" link for new users
- Error handling with user-friendly messages
- Loading states
- Callback URL support for redirects

### Sign Up Page
**Route:** `/auth/sign-up`

**Features:**
- Name (optional), email, password, confirm password
- Real-time password validation
- Auto sign-in after successful registration
- Redirects to home page
- Success state
- Error handling

### Forgot Password Page
**Route:** `/auth/forgot-password`

**Features:**
- Email input
- Success state with instructions
- "Try again" option
- "Back to sign in" link
- No email enumeration

### Reset Password Page
**Route:** `/auth/reset-password?token=xxx`

**Features:**
- Token validation on load
- Invalid/expired token handling
- New password and confirmation inputs
- Password requirements display
- Success state with auto-redirect
- 3-second redirect to sign in after success

## NextAuth Configuration

### Providers

1. **Credentials Provider**
   - Email and password authentication
   - Password verification with bcrypt
   - Loads user roles and subscriptions
   - Returns user with roleId and subscriptionId

2. **Yandex Provider**
   - Existing OAuth provider
   - Works alongside credentials

### Session Strategy

- **JWT-based sessions** for credentials provider
- Stores roleId and subscriptionId in JWT
- Custom session callback to include user metadata

### Custom Pages

- Sign In: `/auth/sign-in`
- Sign Out: `/auth/sign-out` (to be created)
- Error: `/auth/error` (to be created)

## Password Requirements

All passwords must meet the following criteria:

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)

Regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`

## Security Features

### Password Hashing
- Uses bcryptjs with salt rounds of 12
- Passwords never stored in plain text
- One-way hashing (cannot be reversed)

### Reset Token Security
- Cryptographically secure random tokens (32 bytes)
- 1-hour expiration
- Single-use tokens (marked as used after reset)
- Old tokens invalidated when new one requested
- Cascade deletion when user deleted

### Session Security
- JWT-based for credentials
- HttpOnly cookies (handled by NextAuth)
- Secure flag in production
- CSRF protection

### Email Enumeration Prevention
- Forgot password always returns success message
- No indication whether email exists

## Email Integration (Placeholder)

Currently, the system logs emails to the console. To integrate with a real email service:

### Recommended Services
- **Resend** - Modern, developer-friendly
- **SendGrid** - Enterprise-grade
- **AWS SES** - Cost-effective
- **Postmark** - Transactional emails

### Implementation Steps

1. Install email service SDK:
```bash
pnpm add resend
# or
pnpm add @sendgrid/mail
```

2. Add environment variables:
```env
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=your-api-key
```

3. Update email functions in `src/server/api/routers/auth/index.ts`:

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string | null
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Reset Your Password - Jemso',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${name ?? 'there'},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}
```

## UI Components

All auth pages use shadcn/ui components:

- **Input** - Text and password inputs
- **Label** - Form labels
- **Button** - Submit and navigation buttons
- **Card** - Page containers
- **Alert** - Error and success messages

Installed via:
```bash
npx shadcn@latest add input label card alert button
```

## Usage Examples

### Protecting Routes

```typescript
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/protected");
  }
  
  return <div>Protected content</div>;
}
```

### Client-Side Session

```typescript
"use client";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

### Sign Out

```typescript
"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
```

## Integration with RBAC

The authentication system is fully integrated with the existing RBAC system:

1. **Auto-Role Assignment**: New users automatically get the "user" role
2. **Session Data**: User's roleId is included in the session
3. **Permission Checks**: All RBAC helpers work with authenticated users
4. **Subscription Tracking**: User's active subscription ID in session

Example:
```typescript
const session = await auth();
if (session) {
  const canPost = await hasPermission(
    db,
    session.user.id,
    "blog_post",
    "create"
  );
}
```

## Testing the System

### 1. Run the Database Migration
```bash
cd web
pnpm db:push
```

### 2. Seed the Database (if needed)
```bash
pnpm db:seed
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Test the Flow

1. **Sign Up**
   - Navigate to http://localhost:3000/auth/sign-up
   - Create a new account
   - Should auto sign-in and redirect to home

2. **Sign Out**
   - Sign out from your application
   
3. **Sign In**
   - Navigate to http://localhost:3000/auth/sign-in
   - Use your credentials
   - Should redirect to home

4. **Forgot Password**
   - Click "Forgot password?" on sign-in page
   - Enter email
   - Check console for reset link
   - Copy the token from the URL

5. **Reset Password**
   - Visit reset link from console
   - Enter new password
   - Should redirect to sign-in
   - Sign in with new password

## Troubleshooting

### "Invalid email or password"
- Check the password meets requirements
- Verify email is correct
- Check if user exists in database

### Reset token invalid
- Token expires after 1 hour
- Token can only be used once
- Request a new reset link

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Type errors
- Run `pnpm db:generate` after schema changes
- Restart TypeScript server in IDE

## Next Steps

1. **Email Integration**: Replace console logs with real email service
2. **Email Verification**: Add email verification flow for new signups
3. **OAuth Providers**: Add more providers (Google, GitHub, etc.)
4. **Two-Factor Auth**: Implement 2FA for enhanced security
5. **Session Management**: Add "Active Sessions" page to manage devices
6. **Account Settings**: Create page for password change
7. **Rate Limiting**: Add rate limiting to prevent brute force attacks

## Related Documentation

- [Database Integration](./DATABASE_INTEGRATION.md)
- [RBAC and Subscriptions](./RBAC_AND_SUBSCRIPTIONS.md)
- [NextAuth.js Documentation](https://next-auth.js.org)

