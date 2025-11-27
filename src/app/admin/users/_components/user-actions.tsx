"use client";

import { MoreHorizontal, Shield, Ban } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface UserActionsProps {
  userId: string;
  userEmail: string | null;
}

export function UserActions({ userId, userEmail }: UserActionsProps) {
  const handleManageRoles = () => {
    // TODO: Implement role management modal
    console.log("Manage roles for:", userId);
  };

  const handleToggleStatus = () => {
    // TODO: Implement user status toggle
    console.log("Toggle status for:", userId);
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
          onClick={() => void navigator.clipboard.writeText(userId)}
        >
          Copy User ID
        </DropdownMenuItem>
        {userEmail && (
          <DropdownMenuItem
            onClick={() => void navigator.clipboard.writeText(userEmail)}
          >
            Copy Email
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleManageRoles}>
          <Shield className="mr-2 h-4 w-4" />
          Manage Roles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus}>
          <Ban className="mr-2 h-4 w-4" />
          Toggle Status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

