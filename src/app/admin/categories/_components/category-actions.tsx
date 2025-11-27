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
        `Cannot delete "${categoryName}" because it's used in ${usedInPosts} blog post(s) and ${usedInEvents ?? 0} event(s). Remove it from all content first.`
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete "${categoryName}"? This cannot be undone.`
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
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Category ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending || totalUsage > 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Deleting..." : "Delete Category"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

