import Image from "next/image";
import type { GalleryBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface GalleryBlockProps {
  block: GalleryBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<GalleryBlock>) => void;
}

export default function GalleryBlockComponent({ block }: GalleryBlockProps) {
  const columns = block.columns ?? 3;

  return (
    <figure className={cn("w-full", block.className)}>
      <div
        className={cn(
          "grid gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          columns === 5 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
          columns === 6 && "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        )}
      >
        {block.images.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg aspect-square">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      {block.caption && (
        <figcaption className="mt-4 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

