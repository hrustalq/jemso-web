import type { ColumnsBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface ColumnsBlockProps {
  block: ColumnsBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<ColumnsBlock>) => void;
}

export default function ColumnsBlockComponent({ block }: ColumnsBlockProps) {
  return (
    <div
      className={cn("grid", block.className)}
      style={{
        gridTemplateColumns: block.columns
          .map((col) => col.width ?? "1fr")
          .join(" "),
        gap: block.gap ?? "1rem",
      }}
    >
      {block.columns.map((column, index) => (
        <div
          key={index}
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />
      ))}
    </div>
  );
}

