import Link from "next/link";
import type { ButtonBlock } from "~/lib/blocks/types";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ButtonBlockProps {
  block: ButtonBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<ButtonBlock>) => void;
}

export default function ButtonBlockComponent({ block }: ButtonBlockProps) {
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[block.alignment ?? "left"];

  return (
    <div className={cn("flex", alignmentClass, block.className)}>
      <Button
        asChild
        variant={block.variant}
        size={block.size}
      >
        <Link href={block.url}>{block.text}</Link>
      </Button>
    </div>
  );
}

