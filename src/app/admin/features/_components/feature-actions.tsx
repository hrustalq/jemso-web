"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
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

interface FeatureActionsProps {
  featureId: string;
  featureName: string;
  usedInPlans: number;
}

export function FeatureActions({
  featureId,
  featureName,
  usedInPlans,
}: FeatureActionsProps) {
  const router = useRouter();

  const deleteMutation = api.subscriptions.features.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleEdit = () => {
    router.push(`/admin/features/${featureId}/edit`);
  };

  const handleDelete = () => {
    if (usedInPlans > 0) {
      alert(
        `Невозможно удалить "${featureName}", потому что она используется в ${usedInPlans} планах. Сначала удалите её из всех планов.`
      );
      return;
    }

    if (
      confirm(
        `Вы уверены, что хотите удалить "${featureName}"? Это действие нельзя отменить.`
      )
    ) {
      deleteMutation.mutate({ id: featureId });
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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(featureId)}
        >
          Скопировать ID функции
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать функцию
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending || usedInPlans > 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Удаление..." : "Удалить функцию"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
