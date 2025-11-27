"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "~/lib/blocks/types";
import { BlockEditor } from "./block-editor-item";
import { GripVertical } from "lucide-react";
import { cn } from "~/lib/utils";

interface SortableBlockItemProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onAddBelow: () => void;
}

export function SortableBlockItem({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBelow,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "z-50 opacity-50"
      )}
    >
      <div className="absolute -left-8 top-0 bottom-0 flex items-start pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <BlockEditor
        block={block}
        index={index}
        totalBlocks={totalBlocks}
        onUpdate={(updates) => onUpdate(block.id, updates)}
        onDelete={() => onDelete(block.id)}
        onDuplicate={() => onDuplicate(block.id)}
        onMoveUp={() => onMoveUp(block.id)}
        onMoveDown={() => onMoveDown(block.id)}
        onAddBelow={onAddBelow}
      />
    </div>
  );
}

