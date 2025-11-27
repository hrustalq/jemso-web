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
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Technology"
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
                Slug cannot be changed after creation
              </p>
            )}
            {!category && (
              <p className="text-xs text-muted-foreground">
                Auto-generated from name. Can be customized.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this category"
              disabled={isLoading}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Image for category page hero section and card background
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverVideo">Cover Video URL</Label>
            <Input
              id="coverVideo"
              type="url"
              value={coverVideo}
              onChange={(e) => setCoverVideo(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Compressed video for category card hover preview (recommended: &lt;5MB, MP4/WebM)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon Identifier</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="drift-icon"
              disabled={isLoading}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Icon name for navigation (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Theme Color</Label>
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
              Color for category branding
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
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
              Lower numbers appear first in navigation
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="showInNav">Show in Navigation</Label>
              <p className="text-xs text-muted-foreground">
                Display this category in main navigation
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
              <Label htmlFor="featured">Featured Category</Label>
              <p className="text-xs text-muted-foreground">
                Highlight this category in featured sections
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
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

