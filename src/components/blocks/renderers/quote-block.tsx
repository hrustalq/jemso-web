import type { QuoteBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface QuoteBlockProps {
  block: QuoteBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<QuoteBlock>) => void;
}

export default function QuoteBlockComponent({ block }: QuoteBlockProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  }[block.alignment ?? "left"];

  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic text-muted-foreground max-w-2xl",
        alignmentClass,
        block.className
      )}
    >
      <p dangerouslySetInnerHTML={{ __html: block.content }} />
      {(block.author ?? block.citation) && (
        <footer className="mt-2 text-sm not-italic">
          {block.author && <cite className="font-semibold">{block.author}</cite>}
          {block.citation && block.author && " — "}
          {block.citation && <span>{block.citation}</span>}
        </footer>
      )}
    </blockquote>
  );
}

