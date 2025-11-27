import Image from "next/image";
import type { TestimonialBlock } from "~/lib/blocks/types";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface TestimonialBlockProps {
  block: TestimonialBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<TestimonialBlock>) => void;
}

export default function TestimonialBlockComponent({ block }: TestimonialBlockProps) {
  return (
    <Card className={cn("max-w-2xl mx-auto", block.className)}>
      <CardContent className="pt-6">
        <blockquote className="text-lg italic text-muted-foreground mb-4">
          &ldquo;{block.quote}&rdquo;
        </blockquote>
        <div className="flex items-center gap-3">
          {block.avatar && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={block.avatar}
                alt={block.author}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-semibold text-foreground">{block.author}</div>
            {block.role && (
              <div className="text-sm text-muted-foreground">{block.role}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

