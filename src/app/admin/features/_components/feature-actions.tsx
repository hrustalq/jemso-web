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
        `Cannot delete "${featureName}" because it's used in ${usedInPlans} plan(s). Remove it from all plans first.`
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete "${featureName}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate({ id: featureId });
    }
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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(featureId)}
        >
          Copy Feature ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Feature
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={deleteMutation.isPending || usedInPlans > 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? "Deleting..." : "Delete Feature"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

