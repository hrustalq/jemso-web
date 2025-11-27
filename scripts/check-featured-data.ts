import { db } from "../src/server/db";

async function checkFeaturedData() {
  console.log("🔍 Checking for featured categories and upcoming events...\n");

  // Check featured categories
  const featuredCategories = await db.category.findMany({
    where: { featured: true },
    select: { id: true, name: true, slug: true, featured: true },
  });

  console.log(`📁 Featured Categories: ${featuredCategories.length}`);
  if (featuredCategories.length > 0) {
    featuredCategories.forEach((cat) => {
      console.log(`   ✓ ${cat.name} (${cat.slug})`);
    });
  } else {
    console.log("   ❌ No featured categories found");
    console.log("   💡 Tip: Set featured=true on some categories in Prisma Studio");
  }

  console.log();

  // Check upcoming events
  const now = new Date();
  const upcomingEvents = await db.event.findMany({
    where: {
      published: true,
      startDate: { gte: now },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      published: true,
    },
    take: 10,
  });

  console.log(`📅 Upcoming Events: ${upcomingEvents.length}`);
  if (upcomingEvents.length > 0) {
    upcomingEvents.forEach((event) => {
      console.log(
        `   ✓ ${event.title} (${event.startDate.toLocaleDateString()})`
      );
    });
  } else {
    console.log("   ❌ No upcoming events found");
    console.log("   💡 Tip: Create events with future dates in Prisma Studio");
  }

  console.log();

  // Check all categories
  const allCategories = await db.category.count();
  console.log(`📊 Total Categories: ${allCategories}`);

  // Check all events
  const allEvents = await db.event.count();
  console.log(`📊 Total Events: ${allEvents}`);

  console.log("\n✅ Check complete!");
  console.log(
    "\n💻 Prisma Studio is running at: http://localhost:5555"
  );
  console.log("   Use it to:");
  console.log("   - Mark categories as featured (set featured = true)");
  console.log("   - Create events with future start dates");
  console.log("   - Set events as published (published = true)");

  await db.$disconnect();
}

checkFeaturedData().catch(console.error);

