import Image from "next/image";
import type { ImageBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface ImageBlockProps {
  block: ImageBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<ImageBlock>) => void;
}

export default function ImageBlockComponent({ block }: ImageBlockProps) {
  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
    wide: "w-full max-w-4xl mx-auto",
    full: "w-full",
  }[block.alignment ?? "center"];

  const containerWidth = block.alignment === "wide" || block.alignment === "full" 
    ? "w-full" 
    : block.width 
    ? `w-[${block.width}px]` 
    : "w-full max-w-2xl";

  return (
    <figure className={cn(alignmentClass, containerWidth, block.className)}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={block.src}
          alt={block.alt}
          width={block.width ?? 800}
          height={block.height ?? 600}
          className="w-full h-auto object-cover"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

