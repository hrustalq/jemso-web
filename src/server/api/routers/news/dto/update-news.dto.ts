import { z } from "zod";
import { createNewsSchema } from "./create-news.dto";

export const updateNewsDto = createNewsSchema.partial().extend({
  id: z.string(),
});

export type UpdateNewsDto = z.infer<typeof updateNewsDto>;
