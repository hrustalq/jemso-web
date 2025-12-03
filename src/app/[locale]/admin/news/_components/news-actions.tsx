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

interface NewsActionsProps {
  postId: string;
  postTitle: string;
  slug?: string;
}

export function NewsActions({ postId, postTitle, slug }: NewsActionsProps) {
  const router = useRouter();

  const deleteMutation = api.news.posts.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleEdit = () => {
    router.push(`/admin/news/${postId}/edit`);
  };

  const handleView = () => {
    if (slug) {
      window.open(`/news/${slug}`, "_blank");
    }
  };

  const handleDelete = () => {
    if (
      confirm(`Вы уверены, что хотите удалить "${postTitle}"? Это действие нельзя отменить.`)
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
          Скопировать ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {slug && (
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Посмотреть на сайте
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending}
        >
          <Trash className="mr-2 h-4 w-4" />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
