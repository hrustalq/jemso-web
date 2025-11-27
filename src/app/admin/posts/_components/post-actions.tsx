"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
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

interface PostActionsProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

export function PostActions({ postId, postSlug, postTitle }: PostActionsProps) {
  const router = useRouter();

  const deleteMutation = api.blog.posts.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleEdit = () => {
    router.push(`/admin/posts/${postId}/edit`);
  };

  const handleView = () => {
    window.open(`/blog/${postSlug}`, "_blank");
  };

  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить "${postTitle}"? Это действие нельзя отменить.`
      )
    ) {
      deleteMutation.mutate({ id: postId });
    }
  };

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(postId)}>
          Скопировать ID статьи
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(postSlug)}
        >
          Скопировать Slug
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Посмотреть статью
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать статью
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Удаление..." : "Удалить статью"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

