import Link from "next/link";
import type { CTABlock } from "~/lib/blocks/types";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CTABlockProps {
  block: CTABlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<CTABlock>) => void;
}

export default function CTABlockComponent({ block }: CTABlockProps) {
  const alignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[block.alignment ?? "center"];

  // Map "primary" to "default" for Button component compatibility
  const buttonVariant = block.variant === "primary" ? "default" : block.variant;

  return (
    <div className={cn("flex flex-col space-y-4 p-8 rounded-lg bg-muted/50", alignmentClass, block.className)}>
      <h3 className="text-2xl font-bold text-foreground">{block.title}</h3>
      {block.description && (
        <p className="text-muted-foreground max-w-2xl">{block.description}</p>
      )}
      <div>
        <Button asChild variant={buttonVariant}>
          <Link href={block.buttonUrl}>{block.buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}

