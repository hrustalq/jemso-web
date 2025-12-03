"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface FeatureFormProps {
  feature?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    featureType: string;
  };
}

export function FeatureForm({ feature }: FeatureFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState(feature?.name ?? "");
  const [slug, setSlug] = useState(feature?.slug ?? "");
  const [description, setDescription] = useState(feature?.description ?? "");
  const [featureType, setFeatureType] = useState<"boolean" | "numeric" | "text">(
    (feature?.featureType as "boolean" | "numeric" | "text") ?? "boolean"
  );

  const createFeature = api.subscriptions.features.create.useMutation({
    onSuccess: () => {
      router.push("/admin/features");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateFeature = api.subscriptions.features.update.useMutation({
    onSuccess: () => {
      router.push("/admin/features");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = {
      name,
      slug,
      description: description || undefined,
      featureType,
    };

    if (feature) {
      updateFeature.mutate({ id: feature.id, ...data });
    } else {
      createFeature.mutate(data);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!feature) {
      // Only auto-generate slug for new features
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  const isLoading = createFeature.isPending || updateFeature.isPending;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Детали функции</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название функции *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Доступ к API"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="api-access"
              required
              disabled={isLoading || !!feature}
            />
            {feature && (
              <p className="text-xs text-muted-foreground">
                Slug нельзя изменить после создания
              </p>
            )}
            {!feature && (
              <p className="text-xs text-muted-foreground">
                Автоматически генерируется из названия. Можно настроить.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Предоставляет программный доступ к API"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featureType">Тип функции *</Label>
            <select
              id="featureType"
              value={featureType}
              onChange={(e) =>
                setFeatureType(e.target.value as "boolean" | "numeric" | "text")
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || !!feature}
            >
              <option value="boolean">Булевый (Да/Нет)</option>
              <option value="numeric">Числовой (например, лимит хранилища, API-вызовы)</option>
              <option value="text">Текст (пользовательское значение)</option>
            </select>
            {feature && (
              <p className="text-xs text-muted-foreground">
                Тип функции нельзя изменить после создания
              </p>
            )}
            {!feature && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Булевый:</strong> Функция либо включена, либо нет (например,{" "}
                  Премиум поддержка)
                </p>
                <p>
                  <strong>Числовой:</strong> Функция имеет числовое значение (например, 50ГБ{" "}
                  Хранилища, 1000 API-вызовов)
                </p>
                <p>
                  <strong>Текст:</strong> Функция имеет пользовательское текстовое значение (например,{" "}
                  Приоритетный доступ к очереди)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {feature ? "Обновить функцию" : "Создать функцию"}
        </Button>
      </div>
    </form>
  );
}

