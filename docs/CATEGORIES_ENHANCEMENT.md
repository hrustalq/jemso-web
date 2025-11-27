# Categories Section Enhancement

## Overview
Enhanced the categories section with larger, more visually appealing cards that support video hover effects on desktop devices.

## Changes Made

### 1. Database Schema Update (`prisma/schema.prisma`)
- Added `coverVideo` field to the `Category` model
- Field type: `String?` (optional)
- Purpose: Store URL to compressed video for hover preview on category cards

```prisma
coverVideo  String?    // Cover video for category card (compressed, for hover preview)
```

### 2. Enhanced Category Cards (`src/components/animated-category-card.tsx`)

#### Visual Improvements
- **Larger Cards**: Changed grid from 4 columns to 3 columns on large screens (`lg:grid-cols-3`)
- **Increased Height**: Cards now have fixed height of 400px for consistent layout
- **Better Spacing**: Increased gap between cards from 4 to 6 units (`gap-6`)

#### New Features
- **Video Hover Effect** (Desktop Only):
  - Video plays automatically when user hovers over a card
  - Video pauses and resets when hover ends
  - Smooth opacity transition (700ms) between image and video
  - Only enabled on desktop (`lg:block`) for better performance
  - Uses `preload="metadata"` for optimized loading

- **Enhanced Layout**:
  - Gradient overlay that intensifies on hover
  - Content positioned at bottom with proper spacing
  - Stats badges positioned at top-right corner
  - All text content transitions smoothly on hover

#### UX/UI Enhancements
- **Typography**: Larger title text (3xl) for better readability
- **Interactive Effects**:
  - Card lifts up on hover (`hover:-translate-y-2`)
  - Enhanced shadow effects with primary color tint
  - Text slides horizontally on hover
  - "Learn More" CTA appears on hover with arrow icon
  - Color accent bar animates from left to right
  
- **Background Handling**:
  - Video for hover state (desktop)
  - Image fallback when video is not available
  - Gradient fallback using category color
  - Scale effect on images when no video is present
  
- **Stats Display**:
  - Moved to top-right corner with backdrop blur
  - Better contrast with background/80 opacity
  - Larger text (sm instead of xs)

### 3. Admin Panel Updates

#### Category DTO (`src/server/api/routers/blog/dto/category.dto.ts`)
- Added `coverVideo` field to `createCategoryDto`
- Added `coverVideo` field to `updateCategoryDto`
- Both support URL validation via Zod

#### Category Form (`src/app/admin/categories/_components/category-form.tsx`)
- Added `coverVideo` input field in the Appearance section
- Field validation: URL type with proper placeholder
- Help text with recommendations: "<5MB, MP4/WebM format"
- Form state management for the new field
- Included in create/update mutations

### 4. TypeScript Types
- Updated `Category` interface in `animated-category-card.tsx` to include `coverVideo: string | null`
- Updated `CategoryFormProps` interface to include `coverVideo: string | null`

## Technical Considerations

### Video Optimization
- Recommended file size: < 5MB
- Recommended formats: MP4 (H.264) or WebM
- Compression: Use tools like FFmpeg or HandBrake
- Resolution: 720p-1080p max
- Duration: 3-10 seconds loops work best

### Performance
- Videos use `preload="metadata"` to avoid loading full video until needed
- Desktop-only feature to preserve mobile performance
- Automatic pause and reset when not hovering
- Fallback to static images on mobile devices

### Browser Compatibility
- Uses native HTML5 video element
- Graceful degradation to images if video fails to load
- Silent autoplay (muted) for better browser compatibility

## Usage

### Adding Video to Category (Admin Panel)
1. Navigate to Admin > Categories
2. Create new or edit existing category
3. In the "Appearance" section, add Cover Video URL
4. Recommended: Use compressed video files (<5MB)
5. Provide a Cover Image as fallback

### Example Video Compression (FFmpeg)
```bash
# Compress video to < 5MB with good quality
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=1280:720 -b:v 800k -maxrate 1M -bufsize 2M output.mp4
```

## Future Enhancements
- Add video upload functionality with automatic compression
- Support for multiple video formats with fallback chain
- Lazy loading videos based on viewport proximity
- Admin preview of video in the form
- Video duration validation
- CDN integration for video hosting

## Related Files
- `/web/prisma/schema.prisma` - Database schema
- `/web/src/components/animated-category-card.tsx` - Main card component
- `/web/src/app/(public)/_components/categories-section.tsx` - Section wrapper
- `/web/src/server/api/routers/blog/dto/category.dto.ts` - API DTOs
- `/web/src/app/admin/categories/_components/category-form.tsx` - Admin form

