import type { SeparatorBlock } from "~/lib/blocks/types";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface SeparatorBlockProps {
  block: SeparatorBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<SeparatorBlock>) => void;
}

export default function SeparatorBlockComponent({ block }: SeparatorBlockProps) {
  const styleClass = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  }[block.style ?? "solid"];

  return <Separator className={cn(styleClass, block.className)} />;
}

