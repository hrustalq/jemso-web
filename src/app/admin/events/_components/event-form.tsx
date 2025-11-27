"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    published: boolean;
    startDate: Date;
    endDate: Date;
    location: string | null;
    locationUrl: string | null;
    maxParticipants: number | null;
    price: { toNumber: () => number };
    currency: string;
    categoryId: string | null;
  };
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [excerpt, setExcerpt] = useState(event?.excerpt ?? "");
  const [content, setContent] = useState(event?.content ?? "");
  const [coverImage, setCoverImage] = useState(event?.coverImage ?? "");
  const [published, setPublished] = useState(event?.published ?? false);
  const [startDate, setStartDate] = useState(
    event?.startDate ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [endDate, setEndDate] = useState(
    event?.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [locationUrl, setLocationUrl] = useState(event?.locationUrl ?? "");
  const [maxParticipants, setMaxParticipants] = useState(
    event?.maxParticipants?.toString() ?? ""
  );
  const [price, setPrice] = useState(
    event?.price ? event.price.toNumber().toString() : "0"
  );
  const [currency, setCurrency] = useState(event?.currency ?? "USD");
  const [categoryId, setCategoryId] = useState(event?.categoryId ?? "");

  // Fetch categories
  const { data: categoriesData } = api.blog.categories.list.useQuery();

  const createEvent = api.event.events.create.useMutation({
    onSuccess: () => {
      router.push("/admin/events");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateEvent = api.event.events.update.useMutation({
    onSuccess: () => {
      router.push("/admin/events");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate) {
      setError("Дата начала и дата окончания обязательны");
      return;
    }

    const data = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content: content || undefined,
      coverImage: coverImage || undefined,
      published,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: location || undefined,
      locationUrl: locationUrl || undefined,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
      price: parseFloat(price),
      currency,
      categoryId: categoryId || undefined,
    };

    if (event) {
      updateEvent.mutate({ id: event.id, ...data });
    } else {
      createEvent.mutate(data);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!event) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  const isLoading = createEvent.isPending || updateEvent.isPending;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название события *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ежегодная технологическая конференция 2025"
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
              placeholder="annual-tech-conference-2025"
              required
              disabled={isLoading || !!event}
            />
            {event && (
              <p className="text-xs text-muted-foreground">
                Slug нельзя изменить после создания
              </p>
            )}
            {!event && (
              <p className="text-xs text-muted-foreground">
                Генерируется автоматически из названия. Можно настроить.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Краткое описание</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Краткое описание события (максимум 500 символов)"
              disabled={isLoading}
              maxLength={500}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {excerpt.length}/500 символов
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Полное описание *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Полное описание события и детали..."
              disabled={isLoading}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Для редактирования расширенного контента используйте блочный редактор после создания события
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">URL обложки</Label>
            <Input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Категория</Label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Без категории</option>
              {categoriesData?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
              disabled={isLoading}
            />
            <Label htmlFor="published">Опубликовано</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Расписание события</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Дата и время начала *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Дата и время окончания *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Местоположение</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Место проведения</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Технологический центр, Москва"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Физический адрес или &ldquo;Онлайн событие&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationUrl">URL местоположения</Label>
            <Input
              id="locationUrl"
              type="url"
              value={locationUrl}
              onChange={(e) => setLocationUrl(e.target.value)}
              placeholder="https://meet.google.com/xyz или ссылка на Google Maps"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Ссылка на встречу для онлайн событий или ссылка на карту для физических событий
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Регистрация и цены</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Максимум участников</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="100"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Оставьте пустым для неограниченного количества участников
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="price">Цена *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Установите 0 для бесплатных событий
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Валюта *</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="RUB">RUB</option>
              </select>
            </div>
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
          {event ? "Обновить событие" : "Создать событие"}
        </Button>
      </div>
    </form>
  );
}
