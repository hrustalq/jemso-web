import type { ParagraphBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface ParagraphBlockProps {
  block: ParagraphBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<ParagraphBlock>) => void;
}

export default function ParagraphBlockComponent({ block }: ParagraphBlockProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[block.alignment ?? "left"];

  return (
    <p
      className={cn(
        "text-base leading-7 text-foreground",
        alignmentClass,
        block.className
      )}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

