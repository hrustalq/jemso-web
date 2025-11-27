/**
 * Script to update category videos
 * Usage: pnpm tsx scripts/update-category-videos.ts
 */

import { db } from "../src/server/db";

async function updateCategoryVideos() {
  console.log("🎬 Updating category videos...\n");

  // Example videos - Replace these URLs with your actual video URLs
  // You can get free racing videos from:
  // - https://www.pexels.com/videos/
  // - https://pixabay.com/videos/
  // - https://www.videvo.net/

  const updates = [
    {
      slug: "drift",
      name: "Дрифт",
      description: "Спортивное направление автомобильного спорта, где главной задачей является управление за помощи заноса",
      coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200",
      coverVideo: null, // Add your drift video URL here
      // Example Pexels search: https://www.pexels.com/search/videos/drift%20car/
      // After finding a video, download it and host it, or use direct link
    },
    {
      slug: "drag",
      name: "Дрэг",
      description: "Гонки на прямой трассе, где побеждает тот, кто первым пересечет финишную черту",
      coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200",
      coverVideo: null, // Add your drag racing video URL here
      // Example Pexels search: https://www.pexels.com/search/videos/drag%20racing/
    },
    {
      slug: "ring",
      name: "Кольцевые гонки",
      description: "Кольцевые автогонки на специализированных трассах с максимальными скоростями и идеальной техникой",
      coverImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200",
      coverVideo: null, // Add your circuit racing video URL here
      // Example Pexels search: https://www.pexels.com/search/videos/race%20track/
    },
  ];

  for (const update of updates) {
    try {
      const category = await db.category.update({
        where: { slug: update.slug },
        data: {
          name: update.name,
          description: update.description,
          coverImage: update.coverImage,
          coverVideo: update.coverVideo,
        },
      });

      console.log(`✅ Updated ${category.name} (${category.slug})`);
      console.log(`   Image: ${category.coverImage ? "✓" : "✗"}`);
      console.log(`   Video: ${category.coverVideo ? "✓" : "✗"}`);
      console.log();
    } catch (error) {
      console.error(`❌ Failed to update ${update.slug}:`, error);
    }
  }

  await db.$disconnect();
  console.log("🎉 Done!");
}

// Example: How to get video URLs from Pexels
console.log("📋 Instructions:");
console.log("1. Visit https://www.pexels.com/videos/");
console.log("2. Search for racing videos (e.g., 'drift car', 'drag racing')");
console.log("3. Click on a video you like");
console.log("4. Click 'Free Download' button");
console.log("5. Right-click the download link and copy URL");
console.log("6. Paste the URL in this script and run it");
console.log("\n" + "=".repeat(50) + "\n");

updateCategoryVideos().catch(console.error);

