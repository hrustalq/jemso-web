import type { JSX } from "react";
import type { HeadingBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface HeadingBlockProps {
  block: HeadingBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<HeadingBlock>) => void;
}

export default function HeadingBlockComponent({ block }: HeadingBlockProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[block.alignment ?? "left"];

  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;

  const headingClasses = {
    "1": "scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl",
    "2": "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0",
    "3": "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
    "4": "scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
    "5": "scroll-m-20 text-lg font-semibold tracking-tight text-foreground",
    "6": "scroll-m-20 text-base font-semibold tracking-tight text-foreground",
  };

  return (
    <Tag
      className={cn(
        headingClasses[block.level],
        alignmentClass,
        block.className
      )}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

