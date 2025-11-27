# Video Sources for Category Cards

## Where to Find Free Racing Videos

### Recommended Free Stock Video Sites

1. **Pexels Videos** (https://www.pexels.com/videos/)
   - Search: "drift car", "drag racing", "race track"
   - License: Free to use, no attribution required
   - Direct MP4 download links available

2. **Pixabay Videos** (https://pixabay.com/videos/)
   - Search: "racing", "motorsport", "drift"
   - License: Free for commercial use
   - Multiple quality options with direct downloads

3. **Videvo** (https://www.videvo.net/)
   - Search: "drift", "drag racing", "circuit racing"
   - License: Mix of free and premium (filter by license)
   - High-quality motorsport footage

4. **Coverr** (https://coverr.co/)
   - Search: "racing", "car", "speed"
   - License: Free for commercial use
   - Short loops perfect for background videos

5. **Mixkit** (https://mixkit.co/free-stock-video/)
   - Search: "car", "racing", "speed"
   - License: Free with no attribution required
   - HD quality downloads

## How to Get Direct Video URLs

### Method 1: Pexels (Recommended)
1. Go to https://www.pexels.com/videos/
2. Search for your racing type (e.g., "drift car")
3. Click on a video
4. Click "Download" and select quality
5. Right-click the download link and copy URL
6. Use this URL in the admin panel

### Method 2: Using Your Own CDN
1. Download video from stock site
2. Compress using HandBrake or FFmpeg:
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=1280:720 -b:v 800k -maxrate 1M -bufsize 2M output.mp4
   ```
3. Upload to your CDN/hosting
4. Use the CDN URL in admin panel

## Recommended Videos by Category

### Drift (Дрифт)
**Search terms:**
- "drift car racing"
- "drifting smoke"
- "car drift track"

**Characteristics:**
- Side angle showing car sliding
- Smoke from tires
- Curved track or parking lot
- Duration: 5-10 seconds

### Drag (Дрэг)
**Search terms:**
- "drag racing start"
- "drag race cars"
- "straight line racing"

**Characteristics:**
- Front or side view of acceleration
- Straight track
- Dramatic launch with smoke
- Duration: 3-8 seconds

### Ring/Circuit Racing (Кольцевые гонки)
**Search terms:**
- "race track circuit"
- "racing cars track"
- "formula racing"
- "motorsport circuit"

**Characteristics:**
- Multiple cars on track
- Overhead or trackside view
- Professional racing environment
- Duration: 5-10 seconds

## Video Specifications for Best Performance

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1280x720 (720p) or 1920x1080 (1080p)
- **File Size**: < 5MB (recommended < 3MB)
- **Duration**: 3-10 seconds
- **Frame Rate**: 24-30 fps
- **Bitrate**: 800k-1M
- **Audio**: Remove audio track (not needed for background video)

## Quick Setup Example

### Using Pexels Videos (Direct Links)

Example video IDs from Pexels (free to use):

1. **Drift Video Example**:
   - ID: 3203659
   - URL format: `https://player.vimeo.com/external/[ID].hd.mp4`

2. **Racing Video Example**:
   - ID: 854100
   - URL format: `https://player.vimeo.com/external/[ID].hd.mp4`

Note: You'll need to visit Pexels and get the actual download URLs as they change periodically.

## Implementation Steps

1. Choose videos from stock sites above
2. Download videos (or copy direct download URL)
3. Optionally compress videos using FFmpeg
4. Upload to your hosting/CDN (or use direct links)
5. Add URLs in Admin Panel:
   - Navigate to Admin > Categories
   - Edit each category
   - Paste video URL in "Cover Video URL" field
   - Save

## Current Test Videos

The site is currently using sample videos:
- Drift: Google sample video (for testing)

Replace these with proper racing videos from the sources above.

