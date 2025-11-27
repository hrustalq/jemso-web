# How to Add Videos to Category Cards

## Quick Start (5 minutes)

### Step 1: Find Free Racing Videos

Visit **Pexels** (easiest option): https://www.pexels.com/videos/

Search for videos:
- For Drift: Search "drift car" or "drifting"
- For Drag: Search "drag racing" or "straight line racing"
- For Ring: Search "race track" or "circuit racing"

### Step 2: Get Video URL

1. Click on a video you like
2. Click the **"Free Download"** button (select Medium or HD quality)
3. **Method A** (Direct URL):
   - Right-click the download button
   - Select "Copy Link Address"
   - You now have a direct MP4 URL!

4. **Method B** (Download & Host):
   - Download the video
   - Upload to your hosting/CDN
   - Use your hosted URL

### Step 3: Add to Admin Panel

1. Go to your website: http://localhost:3000/admin/categories
2. Click "Edit" on a category (e.g., Drift)
3. Scroll to "Appearance" section
4. Paste the video URL in **"Cover Video URL"** field
5. Click "Update Category"

### Step 4: Test

1. Visit the home page
2. Scroll to "Направления" section
3. Hover over the category card
4. Video should play!

## Recommended Videos from Pexels

Here are some specific Pexels videos you can use right now:

### For Drift Category
Search on Pexels: "drift car"
- Look for videos showing cars sliding/drifting with smoke
- Duration: 5-10 seconds is ideal
- Angle: Side view works best

### For Drag Category  
Search on Pexels: "drag racing"
- Look for videos showing cars launching from start line
- Duration: 3-8 seconds
- Angle: Front or side view of acceleration

### For Ring Category
Search on Pexels: "race track" or "racing cars"
- Look for videos showing cars on circuit
- Duration: 5-10 seconds  
- Angle: Overhead or trackside view

## Alternative: Using Pixabay

Visit: https://pixabay.com/videos/

Same process as Pexels:
1. Search for racing videos
2. Click on video
3. Click "Free Download"
4. Get the MP4 URL
5. Add to admin panel

## Tips for Best Results

### Video Selection
- ✅ Short duration (3-10 seconds)
- ✅ Loopable (seamless beginning/end)
- ✅ Clear action/motion
- ✅ Good lighting
- ✅ Relevant to category
- ❌ Avoid videos with text/watermarks
- ❌ Avoid very long videos (>15 seconds)

### File Size
- Pexels Medium quality (720p): Usually 1-3 MB ✅
- Pexels HD quality (1080p): Usually 3-8 MB ⚠️
- Pexels Full HD (4K): Usually >10 MB ❌

Recommendation: Use Medium (720p) for best performance

### Technical Details
- Format: MP4 (Pexels videos are always MP4)
- Codec: H.264 (automatic from Pexels)
- Resolution: 1280x720 or 1920x1080
- No compression needed from Pexels - they're already optimized!

## Example Direct URLs

Here are the exact steps to get a URL:

1. Go to: https://www.pexels.com/video/red-sports-car-drifting-2389545/
2. Click "Free Download" → Select "Medium (HD)"
3. A download popup appears
4. Right-click the download link
5. "Copy Link Address"
6. Paste in admin panel!

The URL will look like:
```
https://videos.pexels.com/video-files/2389545/2389545-hd_1280_720_30fps.mp4
```

## Troubleshooting

### Video doesn't play
- Check if URL is a direct MP4 link (should end in .mp4)
- Test URL in browser address bar - it should download or play
- Check browser console for errors
- Verify video file size is < 10MB

### Video is too dark/can't see text
- This should be fixed in the latest update
- Text has shadows and background overlay for readability

### Video loads slowly
- Use Medium quality instead of HD
- Consider compressing with: `pnpm tsx` and FFmpeg
- Or use a CDN for hosting

## Need Help?

Check the detailed guide: [VIDEO_SOURCES.md](./VIDEO_SOURCES.md)

Or use the helper script:
```bash
# Edit the script with your video URLs
code scripts/update-category-videos.ts

# Run it
pnpm tsx scripts/update-category-videos.ts
```

