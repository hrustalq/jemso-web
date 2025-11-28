"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  currency: string;
  itemName: string;
  onSubmit: (paymentMethodId: string) => Promise<void>;
}

export function PaymentModal({
  open,
  onOpenChange,
  amount,
  currency,
  itemName,
  onSubmit,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock payment method generation
      // In a real app, this would use Stripe.createPaymentMethod or similar
      const mockPaymentMethodId = cardNumber.startsWith("4000") 
        ? "pm_card_error" // Trigger error for testing
        : `pm_${Math.random().toString(36).substring(2, 10)}`;

      await onSubmit(mockPaymentMethodId);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оплаты");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Оплата</DialogTitle>
          <DialogDescription>
            Введите платежные данные для подписки на {itemName}.
            <br />
            <strong>Итого: {amount} {currency}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Номер карты</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Срок действия</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Оплатить {amount} {currency}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Тестовая оплата: Используйте любой номер карты. Используйте 4000... для имитации ошибки.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

