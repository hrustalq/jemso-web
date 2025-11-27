import { z } from "zod";
import { blocksArraySchema } from "~/lib/blocks/types";

export const updateEventDto = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  blocks: blocksArraySchema.optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  
  // Event-specific fields
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  location: z.string().max(500).optional().nullable(),
  locationUrl: z.string().url().optional().nullable(),
  maxParticipants: z.number().int().positive().optional().nullable(),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type UpdateEventDto = z.infer<typeof updateEventDto>;

