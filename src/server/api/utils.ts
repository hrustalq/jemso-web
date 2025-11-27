import { z } from "zod";

// Paginated query schema
export const paginatedQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export type PaginatedQuery = z.infer<typeof paginatedQuerySchema>;

// Paginated response schema factory
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasMore: z.boolean(),
  });

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

// Helper function to calculate pagination
export function calculatePagination(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    totalPages,
    hasMore,
  };
}

