"use client";

import dynamic from "next/dynamic";

// Dynamically import NewsletterForm to avoid SSR issues during static generation
export const NewsletterForm = dynamic(
  () => import("~/components/newsletter-form").then((mod) => ({ default: mod.NewsletterForm })),
  { ssr: false }
);

