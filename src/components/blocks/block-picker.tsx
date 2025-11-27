"use client";

import { useState, useMemo } from "react";
import type { BlockType } from "~/lib/blocks/types";
import { BLOCK_TYPES } from "~/lib/blocks/types";
import { BLOCK_METADATA } from "~/lib/blocks/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search } from "lucide-react";
import { cn } from "~/lib/utils";

interface BlockPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export function BlockPicker({ open, onClose, onSelect }: BlockPickerProps) {
  const [search, setSearch] = useState("");

  // Group blocks by category
  const blocksByCategory = useMemo(() => {
    const allBlocks = Object.values(BLOCK_TYPES).map((type) => ({
      type,
      ...BLOCK_METADATA[type],
    }));

    // Filter by search
    const filtered = search
      ? allBlocks.filter(
          (block) =>
            block.label.toLowerCase().includes(search.toLowerCase()) ||
            block.description.toLowerCase().includes(search.toLowerCase())
        )
      : allBlocks;

    // Group by category
    const grouped = {
      content: filtered.filter((b) => b.category === "content"),
      media: filtered.filter((b) => b.category === "media"),
      design: filtered.filter((b) => b.category === "design"),
      layout: filtered.filter((b) => b.category === "layout"),
      advanced: filtered.filter((b) => b.category === "advanced"),
    };

    return grouped;
  }, [search]);

  const handleSelect = (type: BlockType) => {
    onSelect(type);
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a Block</DialogTitle>
          <DialogDescription>
            Choose a block type to add to your content
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {search ? (
          <div className="flex-1 overflow-y-auto">
            <BlockGrid
              blocks={Object.values(blocksByCategory).flat()}
              onSelect={handleSelect}
            />
          </div>
        ) : (
          <Tabs defaultValue="content" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-y-auto mt-4">
              <BlockGrid blocks={blocksByCategory.content} onSelect={handleSelect} />
            </TabsContent>

            <TabsContent value="media" className="flex-1 overflow-y-auto mt-4">
              <BlockGrid blocks={blocksByCategory.media} onSelect={handleSelect} />
            </TabsContent>

            <TabsContent value="design" className="flex-1 overflow-y-auto mt-4">
              <BlockGrid blocks={blocksByCategory.design} onSelect={handleSelect} />
            </TabsContent>

            <TabsContent value="layout" className="flex-1 overflow-y-auto mt-4">
              <BlockGrid blocks={blocksByCategory.layout} onSelect={handleSelect} />
            </TabsContent>

            <TabsContent value="advanced" className="flex-1 overflow-y-auto mt-4">
              <BlockGrid blocks={blocksByCategory.advanced} onSelect={handleSelect} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface BlockGridProps {
  blocks: Array<{
    type: BlockType;
    label: string;
    icon: string;
    description: string;
  }>;
  onSelect: (type: BlockType) => void;
}

function BlockGrid({ blocks, onSelect }: BlockGridProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No blocks found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {blocks.map((block) => (
        <button
          key={block.type}
          onClick={() => onSelect(block.type)}
          className={cn(
            "flex flex-col items-start gap-2 p-4 rounded-lg border-2 border-muted",
            "hover:border-primary hover:bg-accent/50 transition-all",
            "text-left group"
          )}
        >
          <div className="text-2xl">{block.icon}</div>
          <div className="space-y-1">
            <div className="font-semibold text-sm group-hover:text-primary transition-colors">
              {block.label}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {block.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

