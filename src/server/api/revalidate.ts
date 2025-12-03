"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidation helpers for on-demand cache invalidation
 * Use these in Server Actions or Route Handlers when data changes
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath
 */

// Revalidate the homepage
export async function revalidateHomePage() {
  revalidatePath("/[locale]", "page");
}

// Revalidate all public pages
export async function revalidatePublicPages() {
  revalidatePath("/[locale]/(public)", "layout");
}

// Revalidate categories pages
export async function revalidateCategories() {
  revalidatePath("/[locale]/(public)/categories", "layout");
  revalidatePath("/[locale]", "page");
}

// Revalidate blog/posts pages
export async function revalidatePosts() {
  revalidatePath("/[locale]/(public)/blog", "layout");
  revalidatePath("/[locale]", "page");
}

// Revalidate events pages
export async function revalidateEvents() {
  revalidatePath("/[locale]/(public)/events", "layout");
  revalidatePath("/[locale]", "page");
}

// Revalidate subscription plans
export async function revalidatePlans() {
  revalidatePath("/[locale]", "page");
}
