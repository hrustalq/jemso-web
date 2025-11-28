import { z } from "zod";

export const paymentSchema = z.object({
  paymentMethodId: z.string().min(1, "Payment method is required"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

