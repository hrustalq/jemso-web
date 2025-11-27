"use client";

/**
 * Block Editor
 * 
 * A WordPress-like block editor with drag-and-drop functionality
 */

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Block, BlockType } from "~/lib/blocks/types";
import { createEmptyBlock, reorderBlocks, removeBlock, updateBlock, duplicateBlock } from "~/lib/blocks/utils";
import { SortableBlockItem } from "./sortable-block-item";
import { BlockPicker } from "./block-picker";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        const reordered = reorderBlocks(newBlocks, 0, 0);
        onChange(reordered);
      }
    }
  };

  const handleAddBlock = (position?: number) => {
    setInsertPosition(position ?? blocks.length);
    setShowBlockPicker(true);
  };

  const handleBlockTypeSelect = (type: BlockType) => {
    const position = insertPosition ?? blocks.length;
    const newBlock = createEmptyBlock(type, position) as Block;
    
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(position, 0, newBlock);
    
    // Reorder all blocks
    const reordered = reorderBlocks(updatedBlocks, 0, 0);
    onChange(reordered);
    
    setShowBlockPicker(false);
    setInsertPosition(null);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    const updated = updateBlock(blocks, blockId, updates);
    onChange(updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updated = removeBlock(blocks, blockId);
    onChange(updated);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const updated = duplicateBlock(blocks, blockId);
    onChange(updated);
  };

  const handleMoveUp = (blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index > 0) {
      const newBlocks = arrayMove(blocks, index, index - 1);
      const reordered = reorderBlocks(newBlocks, 0, 0);
      onChange(reordered);
    }
  };

  const handleMoveDown = (blockId: string) => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = arrayMove(blocks, index, index + 1);
      const reordered = reorderBlocks(newBlocks, 0, 0);
      onChange(reordered);
    }
  };

  return (
    <div className="space-y-4">
      {blocks.length === 0 ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Start building your content</h3>
          <p className="text-muted-foreground mb-4">
            Add your first block to begin creating your post
          </p>
          <Button onClick={() => handleAddBlock(0)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Block
          </Button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id}>
                    <SortableBlockItem
                      block={block}
                      index={index}
                      totalBlocks={blocks.length}
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      onDuplicate={handleDuplicateBlock}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onAddBelow={() => handleAddBlock(index + 1)}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => handleAddBlock()}
              variant="outline"
              size="lg"
              className="w-full max-w-md"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Block
            </Button>
          </div>
        </>
      )}

      <BlockPicker
        open={showBlockPicker}
        onClose={() => {
          setShowBlockPicker(false);
          setInsertPosition(null);
        }}
        onSelect={handleBlockTypeSelect}
      />
    </div>
  );
}

