import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { PostActions } from "./_components/post-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление статьями | Администратор",
  description: "Управление статьями блога",
};

export default async function AdminPostsPage() {
  const posts = await api.blog.posts.list({
    page: 1,
    pageSize: 50,
    published: undefined, // Show all
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Статьи блога</h1>
          <p className="mt-2 text-muted-foreground">
            Создание и управление статьями блога
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Новая статья
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все статьи ({posts.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead>Комментарии</TableHead>
                <TableHead>Опубликовано</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Статьи не найдены. Создайте первую статью!
                  </TableCell>
                </TableRow>
              ) : (
                posts.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline">{post.category.name}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {post.author?.name ?? "Неизвестно"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                      >
                        {post.published ? "Опубликовано" : "Черновик"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>{post._count.comments}</TableCell>
                    <TableCell className="text-sm">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('ru-RU')
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <PostActions
                        postId={post.id}
                        postSlug={post.slug}
                        postTitle={post.title}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

