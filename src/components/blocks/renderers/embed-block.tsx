import type { EmbedBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface EmbedBlockProps {
  block: EmbedBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<EmbedBlock>) => void;
}

function getEmbedUrl(url: string, provider: EmbedBlock["provider"]): string {
  switch (provider) {
    case "youtube": {
      const videoId = (/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.exec(url))?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    case "vimeo": {
      const videoId = (/vimeo\.com\/(\d+)/.exec(url))?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    case "twitter":
    case "instagram":
    case "codepen":
    case "other":
    default:
      return url;
  }
}

export default function EmbedBlockComponent({ block }: EmbedBlockProps) {
  const embedUrl = getEmbedUrl(block.url, block.provider);
  const aspectRatio = block.aspectRatio ?? "16/9";

  return (
    <figure className={cn("w-full max-w-4xl mx-auto", block.className)}>
      <div 
        className="relative overflow-hidden rounded-lg bg-muted"
        style={{ aspectRatio }}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
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

