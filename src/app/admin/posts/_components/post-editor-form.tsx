"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Block } from "~/lib/blocks/types";
import { createEmptyPostContent, generateExcerpt, isValidPostContent } from "~/lib/blocks/utils";
import { BlockEditor } from "~/components/blocks/block-editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostEditorFormProps {
  mode: "create" | "edit";
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    blocks: unknown;
    coverImage: string | null;
    published: boolean;
    categoryId: string | null;
    tags: Array<{ tag: { id: string; name: string } }>;
  };
}

export function PostEditorForm({ mode, post }: PostEditorFormProps) {
  const router = useRouter();
  
  // Parse blocks from post data
  const initialBlocks = post?.blocks && isValidPostContent(post.blocks)
    ? (post.blocks as { version: string; blocks: Block[] }).blocks
    : [];

  // Form state
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
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

  // Auto-generate excerpt from blocks if empty
  useEffect(() => {
    if (!excerpt && blocks.length > 0) {
      const generated = generateExcerpt(blocks);
      setExcerpt(generated);
    }
  }, [blocks, excerpt]);

  // API mutations
  const createMutation = api.blog.posts.create.useMutation({
    onSuccess: (data) => {
      router.push(`/blog/${data.slug}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateMutation = api.blog.posts.update.useMutation({
    onSuccess: (data) => {
      router.push(`/blog/${data.slug}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError(null);

    const postContent = {
      version: "1.0",
      blocks,
    };

    if (mode === "create") {
      createMutation.mutate({
        title,
        slug,
        excerpt: excerpt || undefined,
        content: "", // Empty content for block-based posts
        blocks,
        coverImage: coverImage || undefined,
        published,
      });
    } else if (post) {
      updateMutation.mutate({
        id: post.id,
        title,
        slug,
        excerpt: excerpt || undefined,
        blocks,
        coverImage: coverImage || undefined,
        published,
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const canSubmit = title && slug && blocks.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle>Post Title</CardTitle>
            <CardDescription>
              Enter a compelling title for your post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold h-auto py-3"
            />
          </CardContent>
        </Card>

        {/* Block Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Build your post content using blocks
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-12">
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </CardContent>
        </Card>

        {/* SEO & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="slug"
                  placeholder="post-slug"
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
                    Auto
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly version of the title
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of your post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {excerpt.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
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
            <CardTitle>Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Create Post" : "Update Post"}
                  </>
                )}
              </Button>

              {mode === "edit" && post && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Post
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="ghost"
                className="w-full"
              >
                <Link href="/admin/posts">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Posts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post Info */}
        <Card>
          <CardHeader>
            <CardTitle>Post Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <div>
              <strong>Blocks:</strong> {blocks.length}
            </div>
            <div>
              <strong>Status:</strong> {published ? "Published" : "Draft"}
            </div>
            {excerpt && (
              <div>
                <strong>Excerpt:</strong> {excerpt.length} chars
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Use headings to structure your content</li>
              <li>Add images to make posts more engaging</li>
              <li>Include callouts for important information</li>
              <li>Use code blocks for technical content</li>
              <li>Drag blocks to reorder them</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

