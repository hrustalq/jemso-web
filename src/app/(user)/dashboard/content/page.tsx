"use client";

import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { 
  BookOpen, 
  Lock,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserContentPage() {
  const { data: user, isLoading: loadingUser } = api.user.me.useQuery();
  const { data: posts, isLoading: loadingPosts } = api.blog.posts.list.useQuery({
    page: 1,
    pageSize: 50,
    published: true,
  });

  const isLoading = loadingUser || loadingPosts;

  // Determine user tier from subscription
  const userTier = user?.subscription ? getTierFromPlan(user.subscription.planSlug) : 0;

  // Separate accessible and locked content
  const accessiblePosts = posts?.items.filter(item => (item.minTier ?? 0) <= userTier) ?? [];
  const lockedPosts = posts?.items.filter(item => (item.minTier ?? 0) > userTier) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Контент</h1>
        <p className="mt-2 text-muted-foreground">
          Статьи и материалы доступные для вашего тарифа (Tier {userTier})
        </p>
      </div>

      {/* User Tier Info */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              Ваш уровень доступа: Tier {userTier}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.subscription 
                ? `План: ${user.subscription.planName}`
                : "Оформите подписку для доступа к премиум контенту"
              }
            </p>
          </div>
          {!user?.subscription && (
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
            >
              Upgrade
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Accessible Content */}
      {accessiblePosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Доступный контент ({accessiblePosts.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accessiblePosts.map((post) => (
              <PostCard key={post.id} post={post} isAccessible />
            ))}
          </div>
        </div>
      )}

      {/* Locked Content Preview */}
      {lockedPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            Премиум контент ({lockedPosts.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Повысьте уровень подписки для доступа к этому контенту
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedPosts.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} isAccessible={false} />
            ))}
          </div>
        </div>
      )}

      {accessiblePosts.length === 0 && lockedPosts.length === 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Нет доступного контента</h3>
            <p className="text-muted-foreground">
              Скоро здесь появятся статьи и материалы
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    minTier: number;
    publishedAt: Date | null;
    category: { name: string; slug: string } | null;
  };
  isAccessible: boolean;
}

function PostCard({ post, isAccessible }: PostCardProps) {
  const content = (
    <Card className={`border-border/40 bg-card/50 backdrop-blur h-full transition-all ${
      isAccessible ? "hover:shadow-lg hover:border-primary/50" : "opacity-60"
    }`}>
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image 
            src={post.coverImage} 
            alt={post.title}
            fill
            className={`object-cover ${!isAccessible ? "blur-sm" : ""}`}
          />
          {!isAccessible && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      )}
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
          {post.minTier > 0 && (
            <Badge variant="outline" className="text-xs">
              Tier {post.minTier}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(post.publishedAt).toLocaleDateString("ru-RU")}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (isAccessible) {
    return (
      <Link href={`/blog/${post.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function getTierFromPlan(planSlug: string): number {
  const tierMap: Record<string, number> = {
    "free": 0,
    "basic": 1,
    "advanced": 2,
    "vip": 3,
    "pro": 2,
  };
  return tierMap[planSlug.toLowerCase()] ?? 0;
}

