import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createCommentDto = z.object({
  postId: z.string(),
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
});

export const updateCommentDto = z.object({
  id: z.string(),
  content: z.string().min(1).max(1000),
});

export const approveCommentDto = z.object({
  id: z.string(),
  approved: z.boolean(),
});

export const deleteCommentDto = z.object({
  id: z.string(),
});

export const listCommentsDto = paginatedQuerySchema.extend({
  postId: z.string().optional(),
  approved: z.boolean().optional(),
  authorId: z.string().optional(),
});

export type CreateCommentDto = z.infer<typeof createCommentDto>;
export type UpdateCommentDto = z.infer<typeof updateCommentDto>;
export type ApproveCommentDto = z.infer<typeof approveCommentDto>;
export type DeleteCommentDto = z.infer<typeof deleteCommentDto>;
export type ListCommentsDto = z.infer<typeof listCommentsDto>;

