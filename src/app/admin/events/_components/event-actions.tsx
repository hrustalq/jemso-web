"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash, Eye, Copy } from "lucide-react";
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

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
}

export function EventActions({
  eventId,
  eventTitle,
  eventSlug,
}: EventActionsProps) {
  const router = useRouter();

  const deleteMutation = api.event.events.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleView = () => {
    window.open(`/events/${eventSlug}`, "_blank");
  };

  const handleEdit = () => {
    router.push(`/admin/events/${eventId}/edit`);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить "${eventTitle}"? Это также удалит все регистрации. Это действие нельзя отменить.`
      )
    ) {
      deleteMutation.mutate({ id: eventId });
    }
  };

  const handleCopyId = () => {
    void navigator.clipboard.writeText(eventId);
  };

  const handleCopySlug = () => {
    void navigator.clipboard.writeText(eventSlug);
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
        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          Скопировать ID события
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopySlug}>
          <Copy className="mr-2 h-4 w-4" />
          Скопировать Slug
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Посмотреть событие
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать событие
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Удаление..." : "Удалить событие"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
