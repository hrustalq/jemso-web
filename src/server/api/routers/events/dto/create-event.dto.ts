import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";

export const createEventDto = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(), // Optional: for backward compatibility
  blocks: blocksArraySchema.optional(), // New: structured block content
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  
  // Event-specific fields
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().max(500).optional(),
  locationUrl: z.string().url().optional(),
  maxParticipants: z.number().int().positive().optional(),
  price: z.number().nonnegative().default(0),
  currency: z.string().length(3).default("USD"),
}).refine(
  (data) => data.content ?? (data.blocks && data.blocks.length > 0),
  {
    message: "Either content or blocks must be provided",
    path: ["content"],
  }
).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type CreateEventDto = z.infer<typeof createEventDto>;

