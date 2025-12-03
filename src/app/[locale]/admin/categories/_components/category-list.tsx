import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Eye, EyeOff, Star } from "lucide-react";
import { api } from "~/trpc/server";
import { CategoryActions } from "./category-actions";

export async function CategoryList() {
  const categories = await api.blog.categories.list();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Цвет</TableHead>
          <TableHead>Порядок</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Статьи</TableHead>
          <TableHead>События</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Категории не найдены. Создайте первую категорию!
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {category.name}
                  {category.featured && (
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell>
                {category.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded border"
                      style={{ backgroundColor: category.color }}
                    />
                    <code className="text-xs">{category.color}</code>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{category.order}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={category.showInNav ? "default" : "secondary"}>
                  {category.showInNav ? (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Видимо
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Скрыто
                    </span>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{category._count.posts}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {(category._count as { posts: number; events?: number }).events ?? 0}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <CategoryActions
                  categoryId={category.id}
                  categoryName={category.name}
                  usedInPosts={category._count.posts}
                  usedInEvents={(category._count as { posts: number; events?: number }).events}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
