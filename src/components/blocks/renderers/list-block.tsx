import type { ListBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface ListBlockProps {
  block: ListBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<ListBlock>) => void;
}

export default function ListBlockComponent({ block }: ListBlockProps) {
  const Tag = block.listType === "ordered" ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        "ml-6 text-foreground [&>li]:mt-2",
        block.listType === "ordered" ? "list-decimal" : "list-disc",
        block.className
      )}
    >
      {block.items.map((item, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </Tag>
  );
}

