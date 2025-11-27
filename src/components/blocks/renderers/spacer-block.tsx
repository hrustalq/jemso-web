import type { SpacerBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface SpacerBlockProps {
  block: SpacerBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<SpacerBlock>) => void;
}

export default function SpacerBlockComponent({ block }: SpacerBlockProps) {
  return (
    <div
      className={cn("w-full", block.className)}
      style={{ height: block.height }}
      aria-hidden="true"
    />
  );
}

