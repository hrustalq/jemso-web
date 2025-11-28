"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface EventRegistrationProps {
  eventId: string;
  eventTitle: string;
  price: number;
  currency: string;
  spotsRemaining: number | null;
  isUpcoming: boolean;
}

export function EventRegistration({
  eventId,
  eventTitle,
  price,
  currency,
  spotsRemaining,
  isUpcoming,
}: EventRegistrationProps) {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: existingRegistration, isLoading: checkingRegistration } = 
    api.event.registrations.myRegistrations.useQuery(undefined, {
      enabled: status === "authenticated",
    });

  const register = api.event.registrations.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setSuccess(false);
    },
  });

  // Check if user is already registered for this event
  const isAlreadyRegistered = existingRegistration?.some(
    (reg) => reg.eventId === eventId
  );

  const handleRegister = () => {
    if (status !== "authenticated") {
      router.push(`/auth/sign-in?callbackUrl=/events/${eventId}`);
      return;
    }

    setError(null);
    
    if (price > 0) {
      // For paid events, redirect to checkout or show payment modal
      // For now, we'll just try to register (which will fail without payment method)
      // TODO: Implement payment flow for event registration
      setError("Оплата событий временно недоступна. Пожалуйста, свяжитесь с организатором.");
      return;
    }

    register.mutate({ eventId });
  };

  // Not upcoming or no spots - don't show registration
  if (!isUpcoming || spotsRemaining === 0) {
    return null;
  }

  // Loading session
  if (status === "loading" || checkingRegistration) {
    return (
      <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Already registered
  if (isAlreadyRegistered) {
    return (
      <div className="mb-8 rounded-lg border border-green-500/20 bg-green-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-500" />
        <p className="text-lg font-semibold text-foreground">
          Вы уже зарегистрированы на это событие
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Проверьте раздел &quot;Мои события&quot; в личном кабинете
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push("/dashboard/events")}
        >
          Мои события
        </Button>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="mb-8 rounded-lg border border-green-500/20 bg-green-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-500" />
        <p className="text-lg font-semibold text-foreground">
          Регистрация успешна!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Вы зарегистрированы на &quot;{eventTitle}&quot;
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push("/dashboard/events")}
        >
          Перейти к моим событиям
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
      {error && (
        <Alert variant="destructive" className="mb-4 text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <p className="mb-4 text-lg font-semibold text-foreground">
        Хотите принять участие в этом событии?
      </p>
      
      {price > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Стоимость участия: {price.toLocaleString("ru-RU")} {currency}
        </p>
      )}
      
      {price === 0 && (
        <p className="mb-4 text-sm text-green-500 font-medium">
          Бесплатное участие
        </p>
      )}

      <Button 
        size="lg" 
        className="px-8"
        onClick={handleRegister}
        disabled={register.isPending}
      >
        {register.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Регистрация...
          </>
        ) : status !== "authenticated" ? (
          "Войти для регистрации"
        ) : (
          "Зарегистрироваться"
        )}
      </Button>
    </div>
  );
}

