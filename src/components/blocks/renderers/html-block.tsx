import type { HTMLBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface HTMLBlockProps {
  block: HTMLBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<HTMLBlock>) => void;
}

export default function HTMLBlockComponent({ block }: HTMLBlockProps) {
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", block.className)}
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}

