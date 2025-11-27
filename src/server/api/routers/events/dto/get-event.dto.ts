import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const getEventBySlugDto = z.object({
  slug: z.string(),
});

export const listEventsDto = paginatedQuerySchema.extend({
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  upcoming: z.boolean().optional(), // Filter for upcoming events
  past: z.boolean().optional(), // Filter for past events
});

export type GetEventBySlugDto = z.infer<typeof getEventBySlugDto>;
export type ListEventsDto = z.infer<typeof listEventsDto>;

