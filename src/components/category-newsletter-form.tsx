"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { Mail, User, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface CategoryNewsletterFormProps {
  categoryId: string;
  categoryName: string;
  categoryColor?: string | null;
}

export function CategoryNewsletterForm({ 
  categoryId, 
  categoryName,
  categoryColor 
}: CategoryNewsletterFormProps) {
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
      const response = await fetch("/api/newsletter/subscribe-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          categoryId,
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
      setError(err instanceof Error ? err.message : "Failed to subscribe to category newsletter");
    }
  }, [email, name, categoryId, startTransition]);

  return (
    <Card 
      className="border-2"
      style={{
        borderColor: categoryColor ? `${categoryColor}40` : undefined,
      }}
    >
      <CardHeader>
        <CardTitle 
          className="text-xl sm:text-2xl"
          style={{ color: categoryColor ?? undefined }}
        >
          Подписка на новости {categoryName}
        </CardTitle>
        <CardDescription>
          Получайте последние новости и события по категории {categoryName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center backdrop-blur-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-primary">
                Спасибо за подписку!
              </h3>
              <p className="text-sm text-muted-foreground">
                Вы успешно подписались на новости категории {categoryName}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input - Optional */}
            <div className="space-y-2">
              <Label htmlFor="category-newsletter-name">
                Имя (необязательно)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="category-newsletter-name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Email Input - Required */}
            <div className="space-y-2">
              <Label htmlFor="category-newsletter-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="category-newsletter-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending || !email}
              className="w-full font-semibold uppercase tracking-wide"
              size="lg"
              style={{
                backgroundColor: categoryColor ?? undefined,
              }}
            >
              {isPending ? "Отправка..." : "Подписаться"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

