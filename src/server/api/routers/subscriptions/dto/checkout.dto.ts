import { z } from "zod";

// Promo code validation
export const validatePromoCodeDto = z.object({
  code: z.string().min(1, "Введите промокод"),
  planId: z.string(),
});

export type ValidatePromoCodeDto = z.infer<typeof validatePromoCodeDto>;

// Billing details
export const billingDetailsSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  address: z.string().min(5, "Введите адрес").optional(),
  city: z.string().min(2, "Введите город").optional(),
  country: z.string().min(2, "Выберите страну").optional(),
  postalCode: z.string().optional(),
});

export type BillingDetails = z.infer<typeof billingDetailsSchema>;

// Create checkout session
export const createCheckoutSessionDto = z.object({
  planId: z.string(),
  promoCode: z.string().optional(),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionDto>;

// Update checkout session with billing details
export const updateCheckoutSessionDto = z.object({
  sessionId: z.string(),
  billing: billingDetailsSchema,
});

export type UpdateCheckoutSessionDto = z.infer<typeof updateCheckoutSessionDto>;

// Apply promo code to session
export const applyPromoCodeDto = z.object({
  sessionId: z.string(),
  promoCode: z.string().min(1),
});

export type ApplyPromoCodeDto = z.infer<typeof applyPromoCodeDto>;

// Complete checkout (process payment)
export const completeCheckoutDto = z.object({
  sessionId: z.string(),
  paymentMethodId: z.string().optional(), // Optional for free plans
  billing: billingDetailsSchema,
});

export type CompleteCheckoutDto = z.infer<typeof completeCheckoutDto>;

// Promo code response
export const promoCodeResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number(),
  discountAmount: z.number(),
  finalPrice: z.number(),
  valid: z.boolean(),
  message: z.string().optional(),
});

export type PromoCodeResponse = z.infer<typeof promoCodeResponseSchema>;

// Checkout session response
export const checkoutSessionResponseSchema = z.object({
  id: z.string(),
  plan: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    currency: z.string(),
    billingInterval: z.string(),
    trialDays: z.number(),
    features: z.array(z.object({
      feature: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        featureType: z.string(),
      }),
      value: z.string().nullable(),
    })),
  }),
  promoCode: promoCodeResponseSchema.nullable(),
  originalPrice: z.number(),
  discountAmount: z.number(),
  finalPrice: z.number(),
  currency: z.string(),
  billing: billingDetailsSchema.nullable(),
  expiresAt: z.date(),
});

export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;

