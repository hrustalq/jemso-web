# 🎬 Replace Sample Videos with Real Racing Videos

## ✅ Current Status
All three categories now have **working sample videos** for testing.
The video hover feature is fully functional!

## 🎯 Next Step: Add Real Racing Videos

### Quick Method (5 minutes)

I've found the perfect videos for each category on Pexels. Follow these exact steps:

---

### 1. DRIFT Category (Дрифт)

**Recommended Video:** "Red Sports Car Drifting"
- **Pexels Page:** https://www.pexels.com/video/red-sports-car-drifting-2389545/

**Steps:**
1. Visit the link above
2. Click **"Free Download"** button
3. Select **"Medium (HD) - 1280x720"** (best for web)
4. Right-click the download button → **"Copy Link Address"**
5. Go to: http://localhost:3000/admin/categories
6. Click **"Edit"** on Drift category
7. Paste URL in **"Cover Video URL"** field
8. Click **"Update Category"**

**Alternative videos:**
- https://www.pexels.com/video/a-sports-car-drifting-on-a-race-track-3232208/
- https://www.pexels.com/video/car-drifting-on-race-track-4022015/

---

### 2. DRAG Category (Дрэг)

**Recommended Video:** "Sports Car Accelerating"
- **Pexels Page:** https://www.pexels.com/video/sports-car-accelerating-854400/

**Steps:**
1. Visit the link above
2. Click **"Free Download"** button
3. Select **"Medium (HD) - 1280x720"**
4. Right-click the download button → **"Copy Link Address"**
5. Go to: http://localhost:3000/admin/categories
6. Click **"Edit"** on Drag category
7. Paste URL in **"Cover Video URL"** field
8. Click **"Update Category"**

**Alternative videos:**
- https://www.pexels.com/video/car-racing-on-a-highway-3197388/
- https://www.pexels.com/video/red-sports-car-on-a-race-track-2795750/

---

### 3. RING Category (Кольцевые гонки)

**Recommended Video:** "Formula One Race"
- **Pexels Page:** https://www.pexels.com/video/formula-one-race-854103/

**Steps:**
1. Visit the link above
2. Click **"Free Download"** button
3. Select **"Medium (HD) - 1280x720"**
4. Right-click the download button → **"Copy Link Address"**
5. Go to: http://localhost:3000/admin/categories
6. Click **"Edit"** on Ring category
7. Paste URL in **"Cover Video URL"** field
8. Click **"Update Category"**

**Alternative videos:**
- https://www.pexels.com/video/cars-racing-on-a-race-track-4057755/
- https://www.pexels.com/video/race-cars-on-racing-track-4057756/

---

## 🎨 What You'll Get

After updating with real videos, when users hover over cards:
- **Drift card** → Shows actual drift racing with smoke and slides
- **Drag card** → Shows powerful acceleration down straight track
- **Ring card** → Shows professional circuit racing

---

## 💡 Pro Tips

### URL Format
The URL should look like:
```
https://videos.pexels.com/video-files/2389545/2389545-hd_1280_720_30fps.mp4
```

### Testing
After adding each video:
1. Visit: http://localhost:3000
2. Scroll to "Направления" section
3. Hover over the card (desktop only)
4. Video should play smoothly!

### Troubleshooting
- **Video doesn't play?** Check if URL ends with `.mp4`
- **Loading slow?** Use "Medium" quality instead of "HD"
- **Can't find download button?** Make sure you're on Pexels, not Pinterest or similar

---

## 🚀 Automated Method

Or use this script to update all at once:

```typescript
// scripts/update-to-real-videos.ts
import { db } from "../src/server/db";

async function updateToRealVideos() {
  // Add your Pexels URLs here
  await db.category.update({
    where: { slug: 'drift' },
    data: {
      coverVideo: 'PASTE_YOUR_DRIFT_VIDEO_URL_HERE'
    }
  });
  
  await db.category.update({
    where: { slug: 'drag' },
    data: {
      coverVideo: 'PASTE_YOUR_DRAG_VIDEO_URL_HERE'
    }
  });
  
  await db.category.update({
    where: { slug: 'ring' },
    data: {
      coverVideo: 'PASTE_YOUR_RING_VIDEO_URL_HERE'
    }
  });
  
  await db.$disconnect();
  console.log('✅ All videos updated with real racing footage!');
}

updateToRealVideos();
```

Run with: `pnpm tsx scripts/update-to-real-videos.ts`

---

## ✨ That's It!

Your category cards will now have professional racing videos that play on hover! 🏁

