"use client";

import { useState } from "react";
import { Mail, User, CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";
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

  const subscribe = api.blog.newsletter.subscribeToCategory.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setEmail("");
      setName("");
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate({ 
      email, 
      name: name || undefined,
      categoryId 
    });
  };

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
                  disabled={subscribe.isPending}
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
                  disabled={subscribe.isPending}
                />
              </div>
            </div>

            {/* Error Message */}
            {subscribe.error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">
                  {subscribe.error.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={subscribe.isPending || !email}
              className="w-full font-semibold uppercase tracking-wide"
              size="lg"
              style={{
                backgroundColor: categoryColor ?? undefined,
              }}
            >
              {subscribe.isPending ? "Отправка..." : "Подписаться"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

