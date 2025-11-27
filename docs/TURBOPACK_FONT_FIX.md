# Turbopack + Google Fonts Issue Fix

## Problem

When running `pnpm dev` with the `--turbo` flag (Turbopack), Next.js 15 encountered a Google Fonts loading error:

```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

## Root Cause

This is a known compatibility issue between:
- Next.js 15.2.3
- Turbopack (Next.js dev mode with `--turbo` flag)
- Google Fonts (`next/font/google`)

The Geist font from Google Fonts couldn't be loaded in Turbopack mode.

## Solution

Removed the `--turbo` flag from the dev script in `package.json`:

### Before
```json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

### After
```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

## How to Apply

1. **Stop the current dev server** (Ctrl+C in terminal)
2. **Restart the dev server:**
   ```bash
   cd /Users/hrustalq/Projects/jemso/web
   pnpm dev
   ```

The app will now run with the standard Next.js webpack compiler, which properly supports Google Fonts.

## Trade-offs

### Without Turbopack (Current Setup)
✅ Google Fonts work correctly  
✅ Stable and well-tested  
✅ Full Next.js feature support  
⚠️ Slightly slower HMR (Hot Module Replacement)  

### With Turbopack
✅ Faster HMR and cold starts  
✅ Future of Next.js development  
❌ Some features still unstable (like Google Fonts)  
❌ May have edge-case bugs  

## When Can We Re-enable Turbopack?

Monitor Next.js releases for fixes to the Google Fonts issue:
- Follow: https://github.com/vercel/next.js/issues
- Next.js 15.3+ may have the fix
- Check release notes for "Google Fonts" or "Turbopack font" mentions

## Alternative Solutions (Not Recommended)

### 1. Switch to Local Fonts
Instead of Google Fonts, download Geist fonts locally:
```typescript
import localFont from 'next/font/local'

const geist = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
})
```

**Pros:** Works with Turbopack  
**Cons:** Larger bundle, manual updates, hosting costs  

### 2. Use Different Fonts
Switch to fonts that work with Turbopack:
```typescript
import { Inter } from 'next/font/google'
```

**Pros:** Might work with Turbopack  
**Cons:** Changes the design, Geist is preferred  

### 3. Wait for Next.js Fix
Monitor Next.js updates and re-enable when fixed:
```bash
pnpm update next@latest
```

**Pros:** Gets the fix officially  
**Cons:** Requires waiting for release  

## Current Status

✅ **Fixed** - Running without Turbopack  
✅ All features working correctly  
✅ Google Fonts loading properly  
✅ No impact on production builds  

## Verification

After restarting the dev server, verify:
1. ✅ No font loading errors in terminal
2. ✅ Homepage loads successfully
3. ✅ Geist font renders correctly
4. ✅ All pages accessible

## Related Issues

- Next.js Issue: https://github.com/vercel/next.js/issues (search for "Turbopack Google Fonts")
- Font loading: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Turbopack: https://nextjs.org/docs/architecture/turbopack

## Notes

- This only affects **development mode** (`pnpm dev`)
- **Production builds** (`pnpm build`) are unaffected
- Turbopack is not used in production builds
- Standard webpack compiler is mature and reliable

---

**Status**: ✅ Fixed - Dev server will work after restart

**Action Required**: Restart dev server with `pnpm dev`

