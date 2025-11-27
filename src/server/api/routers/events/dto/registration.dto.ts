import { z } from "zod";
import { paginatedQuerySchema } from "~/server/api/utils";

export const createRegistrationDto = z.object({
  eventId: z.string(),
  paymentMethod: z.string().optional(),
});

export const updateRegistrationDto = z.object({
  id: z.string(),
  status: z.enum(["pending", "confirmed", "canceled", "attended"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
  notes: z.string().optional(),
});

export const cancelRegistrationDto = z.object({
  id: z.string(),
  reason: z.string().optional(),
});

export const listRegistrationsDto = paginatedQuerySchema.extend({
  eventId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(["pending", "confirmed", "canceled", "attended"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
});

export const confirmPaymentDto = z.object({
  id: z.string(),
  paidAmount: z.number().nonnegative(),
  paymentMethod: z.string(),
});

export type CreateRegistrationDto = z.infer<typeof createRegistrationDto>;
export type UpdateRegistrationDto = z.infer<typeof updateRegistrationDto>;
export type CancelRegistrationDto = z.infer<typeof cancelRegistrationDto>;
export type ListRegistrationsDto = z.infer<typeof listRegistrationsDto>;
export type ConfirmPaymentDto = z.infer<typeof confirmPaymentDto>;

