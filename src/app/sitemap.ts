import type { MetadataRoute } from "next";
import { db } from "~/server/db";
import { routing } from "~/i18n/routing";

// Use VERCEL_URL in production, localhost in development
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Define locales and default locale from routing config
const locales = routing.locales; // ["ru", "en"]
const defaultLocale = routing.defaultLocale; // "ru"

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Get localized URL for a given path
 * Russian (default) doesn't have prefix, English has /en prefix
 */
function getLocalizedUrl(path: string, locale: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return `${BASE_URL}${normalizedPath}`;
  }
  return `${BASE_URL}/${locale}${normalizedPath}`;
}

/**
 * Create sitemap entry with language alternates
 */
function createSitemapEntry(
  path: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?: SitemapEntry["changeFrequency"];
    priority?: number;
  } = {}
): SitemapEntry {
  const { lastModified, changeFrequency, priority } = options;

  // Build language alternates object
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = getLocalizedUrl(path, locale);
  }

  return {
    url: getLocalizedUrl(path, defaultLocale),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities
  const staticPages: Array<{
    path: string;
    changeFrequency: SitemapEntry["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "daily", priority: 0.9 },
    { path: "/news", changeFrequency: "daily", priority: 0.9 },
    { path: "/events", changeFrequency: "daily", priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "weekly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { path: "/shop", changeFrequency: "weekly", priority: 0.7 },
    { path: "/club", changeFrequency: "monthly", priority: 0.6 },
    { path: "/drift", changeFrequency: "weekly", priority: 0.7 },
    { path: "/drag", changeFrequency: "weekly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  // Create static page entries
  const staticEntries = staticPages.map((page) =>
    createSitemapEntry(page.path, {
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  );

  // Fetch dynamic content from database
  const [blogPosts, newsArticles, events, categories] = await Promise.all([
    // Published blog posts
    db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    // Published news articles
    db.news.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    // Published events
    db.event.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { startDate: "desc" },
    }),
    // All categories
    db.category.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Create blog post entries
  const blogEntries = blogPosts.map((post) =>
    createSitemapEntry(`/blog/${post.slug}`, {
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // Create news entries
  const newsEntries = newsArticles.map((article) =>
    createSitemapEntry(`/news/${article.slug}`, {
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // Create event entries
  const eventEntries = events.map((event) =>
    createSitemapEntry(`/events/${event.slug}`, {
      lastModified: event.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // Create category entries (both for /categories/[slug] and /blog/category/[slug])
  const categoryEntries = categories.flatMap((category) => [
    createSitemapEntry(`/categories/${category.slug}`, {
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
    createSitemapEntry(`/blog/category/${category.slug}`, {
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  ]);

  return [
    ...staticEntries,
    ...blogEntries,
    ...newsEntries,
    ...eventEntries,
    ...categoryEntries,
  ];
}

