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

interface PlanActionsProps {
  planId: string;
  planName: string;
}

export function PlanActions({ planId, planName: _planName }: PlanActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/plans/${planId}/edit`);
  };

  const handleDelete = () => {
    // TODO: Implement delete confirmation dialog
    console.log("Delete plan:", planId);
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(planId)}>
          Скопировать ID плана
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать план
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Удалить план
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
