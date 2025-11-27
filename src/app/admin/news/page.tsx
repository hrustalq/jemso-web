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
import { NewsActions } from "./_components/news-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление новостями | Администратор",
  description: "Управление новостными статьями и объявлениями",
};

export default async function NewsPage() {
  // Fetch news posts (blog posts in news category or with specific tag)
  const posts = await api.blog.posts.list({
    page: 1,
    pageSize: 50,
    published: undefined, // Show all statuses
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Новости</h1>
          <p className="mt-2 text-muted-foreground">
            Управление новостными статьями и объявлениями
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
          <CardTitle>Все новостные статьи ({posts.total})</CardTitle>
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
                <TableHead>Опубликовано</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Новостные статьи не найдены. Создайте первую статью!
                  </TableCell>
                </TableRow>
              ) : (
                posts.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline">{post.category.name}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('ru-RU')
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <NewsActions postId={post.id} postTitle={post.title} />
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
