"use client";

import { MoreHorizontal, Shield } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
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
          onClick={() => void navigator.clipboard.writeText(userId)}
        >
          Скопировать ID пользователя
        </DropdownMenuItem>
        {userEmail && (
          <DropdownMenuItem
            onClick={() => void navigator.clipboard.writeText(userEmail)}
          >
            Скопировать Email
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${userId}`}>
            <Shield className="mr-2 h-4 w-4" />
            Редактировать / Детали
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={handleToggleStatus}>
          <Ban className="mr-2 h-4 w-4" />
          Изменить статус
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

