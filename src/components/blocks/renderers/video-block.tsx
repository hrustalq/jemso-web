import type { VideoBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface VideoBlockProps {
  block: VideoBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<VideoBlock>) => void;
}

export default function VideoBlockComponent({ block }: VideoBlockProps) {
  return (
    <figure className={cn("w-full max-w-4xl mx-auto", block.className)}>
      <div className="relative overflow-hidden rounded-lg">
        <video
          src={block.src}
          controls={block.controls ?? true}
          autoPlay={block.autoplay ?? false}
          loop={block.loop ?? false}
          className="w-full h-auto"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

