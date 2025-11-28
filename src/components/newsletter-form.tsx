"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { Mail, User, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        startTransition(() => {
          setSuccess(false);
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, startTransition]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);

    startTransition(() => {
      // Mark the start of transition
    });

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to subscribe");
      }

      startTransition(() => {
        setSuccess(true);
        setEmail("");
        setName("");
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe to newsletter");
    }
  }, [email, name, startTransition]);

  if (success) {
    return (
      <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center backdrop-blur-sm sm:p-6">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary sm:h-12 sm:w-12" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-primary sm:text-lg">
            Спасибо за подписку!
          </h3>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Вы успешно подписались на нашу рассылку.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider sm:text-base">
          Подписка на рассылку
        </h3>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Получайте последние новости и обновления.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Name Input - Optional */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="newsletter-name" className="text-xs sm:text-sm">
            Имя (необязательно)
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="newsletter-name"
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 text-sm"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Email Input - Required */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="newsletter-email" className="text-xs sm:text-sm">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="newsletter-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 text-sm"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2 sm:p-3">
            <p className="text-xs text-destructive sm:text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending || !email}
          className="w-full text-xs font-semibold uppercase tracking-wide sm:text-sm"
          size="default"
        >
          {isPending ? "Отправка..." : "Подписаться"}
        </Button>
      </form>
    </div>
  );
}

