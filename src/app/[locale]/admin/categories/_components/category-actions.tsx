"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

interface CategoryActionsProps {
  categoryId: string;
  categoryName: string;
  usedInPosts: number;
  usedInEvents?: number;
}

export function CategoryActions({
  categoryId,
  categoryName,
  usedInPosts,
  usedInEvents,
}: CategoryActionsProps) {
  const router = useRouter();

  const deleteMutation = api.blog.categories.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleEdit = () => {
    router.push(`/admin/categories/${categoryId}/edit`);
  };

  const handleDelete = () => {
    const totalUsage = usedInPosts + (usedInEvents ?? 0);

    if (totalUsage > 0) {
      alert(
        `Невозможно удалить "${categoryName}", потому что она используется в ${usedInPosts} статьях блога и ${usedInEvents ?? 0} событиях. Сначала удалите её из всего контента.`
      );
      return;
    }

    if (
      confirm(
        `Вы уверены, что хотите удалить "${categoryName}"? Это действие нельзя отменить.`
      )
    ) {
      deleteMutation.mutate({ id: categoryId });
    }
  };

  const handleCopyId = () => {
    void navigator.clipboard.writeText(categoryId);
  };

  const totalUsage = usedInPosts + (usedInEvents ?? 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Открыть меню</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Действия</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          Скопировать ID категории
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать категорию
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending || totalUsage > 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Удаление..." : "Удалить категорию"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
