"use client";

import { useState } from "react";
import type { Block } from "~/lib/blocks/types";
import { BLOCK_METADATA } from "~/lib/blocks/utils";
import { BlockRenderer } from "./block-renderer";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  MoreVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface BlockEditorProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: () => void;
}

export function BlockEditor({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBelow,
}: BlockEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const metadata = BLOCK_METADATA[block.type];

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 transition-all",
        isFocused
          ? "border-primary bg-accent/5"
          : "border-transparent hover:border-muted-foreground/20"
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Block toolbar */}
      <div
        className={cn(
          "absolute -top-10 left-0 right-0 flex items-center justify-between px-2 py-1 transition-opacity",
          isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background rounded-md border px-2 py-1">
          <span>{metadata.icon}</span>
          <span className="font-medium">{metadata.label}</span>
        </div>

        <div className="flex items-center gap-1 bg-background rounded-md border">
          <Button
            size="sm"
            variant="ghost"
            onClick={onMoveUp}
            disabled={index === 0}
            className="h-7 px-2"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onMoveDown}
            disabled={index === totalBlocks - 1}
            className="h-7 px-2"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddBelow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Block Below
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Block content */}
      <div className="p-4">
        <BlockRenderer
          block={block}
          editable={true}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

