"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { CKEditorComponent } from "~/components/ckeditor/ckeditor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface NewsEditorFormProps {
  mode: "create" | "edit";
  news?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    htmlContent: string | null;
    coverImage: string | null;
    published: boolean;
    categoryId: string | null;
    tags: Array<{ tag: { id: string; name: string } }>;
    minTier: number;
  };
}

export function NewsEditorForm({ mode, news }: NewsEditorFormProps) {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState(news?.title ?? "");
  const [slug, setSlug] = useState(news?.slug ?? "");
  const [excerpt, setExcerpt] = useState(news?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(news?.coverImage ?? "");
  const [published, setPublished] = useState(news?.published ?? false);
  const [htmlContent, setHtmlContent] = useState(news?.htmlContent ?? news?.content ?? "");
  const [minTier, setMinTier] = useState(news?.minTier?.toString() ?? "0");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  }, [title, autoSlug]);

  // Auto-generate excerpt
  useEffect(() => {
    if (!excerpt && htmlContent) {
      const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
      const generated = textContent.length > 160 
        ? textContent.slice(0, 160) + "..." 
        : textContent;
      if (generated) {
        setExcerpt(generated);
      }
    }
  }, [htmlContent, excerpt]);

  // API mutations
  const createMutation = api.news.posts.create.useMutation({
    onSuccess: (data) => {
      router.push(`/news/${data.slug}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateMutation = api.news.posts.update.useMutation({
    onSuccess: (data) => {
      router.push(`/news/${data.slug}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError(null);

    const minTierInt = parseInt(minTier);

    if (mode === "create") {
      createMutation.mutate({
        title,
        slug,
        excerpt: excerpt || undefined,
        htmlContent: htmlContent || undefined,
        coverImage: coverImage || undefined,
        published,
        minTier: minTierInt,
      });
    } else if (news) {
      updateMutation.mutate({
        id: news.id,
        title,
        slug,
        excerpt: excerpt || undefined,
        htmlContent: htmlContent || undefined,
        coverImage: coverImage || undefined,
        published,
        minTier: minTierInt,
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const canSubmit = title && slug && htmlContent.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle>Заголовок новости</CardTitle>
            <CardDescription>
              Введите заголовок для вашей новости
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Введите заголовок..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold h-auto py-3"
            />
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Контент</CardTitle>
            <CardDescription>
              Создайте контент новости
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CKEditorComponent
              value={htmlContent}
              onChange={setHtmlContent}
              placeholder="Начните вводить текст..."
              minHeight="500px"
              maxHeight="1000px"
            />
          </CardContent>
        </Card>

        {/* SEO & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>SEO и метаданные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="slug"
                  placeholder="news-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setAutoSlug(false);
                  }}
                />
                {mode === "create" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAutoSlug(true)}
                  >
                    Авто
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea
                id="excerpt"
                placeholder="Краткое описание..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="coverImage">URL обложки</Label>
              <Input
                id="coverImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Публикация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Опубликовано</Label>
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="minTier">Уровень доступа</Label>
                <Select value={minTier} onValueChange={setMinTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Все (Бесплатно)</SelectItem>
                    <SelectItem value="1">Базовый</SelectItem>
                    <SelectItem value="2">Продвинутый</SelectItem>
                    <SelectItem value="3">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Минимальный уровень подписки для просмотра
                </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Создать" : "Обновить"}
                  </>
                )}
              </Button>

              {mode === "edit" && news && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href={`/news/${news.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Посмотреть
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="ghost"
                className="w-full"
              >
                <Link href="/admin/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Назад к новостям
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

