import { TRPCError } from "@trpc/server";

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed";
  clientSecret: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
  metadata?: Record<string, string>;
}

class MockPaymentService {
  private static instance: MockPaymentService;
  
  // In-memory store for mock transactions (reset on server restart)
  private transactions = new Map<string, PaymentIntent>();

  // Private constructor to enforce singleton
  private constructor() {
    // Initialization if needed
  }

  public static getInstance(): MockPaymentService {
    if (!MockPaymentService.instance) {
      MockPaymentService.instance = new MockPaymentService();
    }
    return MockPaymentService.instance;
  }

  /**
   * Process a payment immediately (Mocking a synchronous charge)
   */
  async processPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    const { amount, currency, paymentMethodId } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate failure for specific mock card numbers
    if (paymentMethodId === "pm_card_error") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Your card was declined.",
      });
    }

    const id = `pi_${Math.random().toString(36).substring(2, 15)}`;
    
    const paymentIntent: PaymentIntent = {
      id,
      amount,
      currency,
      status: "succeeded",
      clientSecret: `secret_${id}`,
      metadata: params.metadata,
    };

    this.transactions.set(id, paymentIntent);

    return paymentIntent;
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(id: string): Promise<PaymentIntent | null> {
    return this.transactions.get(id) ?? null;
  }
}

export const paymentService = MockPaymentService.getInstance();

