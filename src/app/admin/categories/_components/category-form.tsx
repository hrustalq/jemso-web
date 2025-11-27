"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
    coverVideo: string | null;
    icon: string | null;
    color: string | null;
    featured: boolean;
    order: number;
    showInNav: boolean;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [coverImage, setCoverImage] = useState(category?.coverImage ?? "");
  const [coverVideo, setCoverVideo] = useState(category?.coverVideo ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");
  const [color, setColor] = useState(category?.color ?? "#D32F2F");
  const [featured, setFeatured] = useState(category?.featured ?? false);
  const [order, setOrder] = useState(category?.order?.toString() ?? "0");
  const [showInNav, setShowInNav] = useState(category?.showInNav ?? true);

  const createCategory = api.blog.categories.create.useMutation({
    onSuccess: () => {
      router.push("/admin/categories");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateCategory = api.blog.categories.update.useMutation({
    onSuccess: () => {
      router.push("/admin/categories");
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
      coverImage: coverImage || undefined,
      coverVideo: coverVideo || undefined,
      icon: icon || undefined,
      color: color || undefined,
      featured,
      order: parseInt(order),
      showInNav,
    };

    if (category) {
      updateCategory.mutate({ id: category.id, ...data });
    } else {
      createCategory.mutate(data);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!category) {
      // Only auto-generate slug for new categories
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;

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
          <CardTitle>Детали категории</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название категории *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Технологии"
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
              placeholder="technology"
              required
              disabled={isLoading || !!category}
            />
            {category && (
              <p className="text-xs text-muted-foreground">
                Slug нельзя изменить после создания
              </p>
            )}
            {!category && (
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
              placeholder="Краткое описание этой категории"
              disabled={isLoading}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 символов
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Внешний вид</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverImage">URL обложки изображения</Label>
            <Input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Изображение для героя страницы категории и фона карточки
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverVideo">URL обложки видео</Label>
            <Input
              id="coverVideo"
              type="url"
              value={coverVideo}
              onChange={(e) => setCoverVideo(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Сжатое видео для предпросмотра карточки категории при наведении (рекомендуется: &lt;5МБ, MP4/WebM)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Идентификатор иконки</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="drift-icon"
              disabled={isLoading}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Название иконки для навигации (необязательно)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Цвет темы</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isLoading}
                className="h-10 w-20"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#D32F2F"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Цвет для брендирования категории
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order">Порядок отображения</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="0"
              disabled={isLoading}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Меньшие числа отображаются первыми в навигации
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="showInNav">Показывать в навигации</Label>
              <p className="text-xs text-muted-foreground">
                Отображать эту категорию в основной навигации
              </p>
            </div>
            <Switch
              id="showInNav"
              checked={showInNav}
              onCheckedChange={setShowInNav}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Рекомендуемая категория</Label>
              <p className="text-xs text-muted-foreground">
                Выделить эту категорию в рекомендуемых разделах
              </p>
            </div>
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
              disabled={isLoading}
            />
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
          {category ? "Обновить категорию" : "Создать категорию"}
        </Button>
      </div>
    </form>
  );
}

