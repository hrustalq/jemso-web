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
        `Are you sure you want to delete "${eventTitle}"? This will also delete all registrations. This cannot be undone.`
      )
    ) {
      deleteMutation.mutate({ id: eventId });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(eventId);
  };

  const handleCopySlug = () => {
    navigator.clipboard.writeText(eventSlug);
  };

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
          Copy Event ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopySlug}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Slug
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View Event
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Event
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
