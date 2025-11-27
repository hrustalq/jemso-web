import Image from "next/image";
import Link from "next/link";
import type { CardBlock } from "~/lib/blocks/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface CardBlockProps {
  block: CardBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<CardBlock>) => void;
}

export default function CardBlockComponent({ block }: CardBlockProps) {
  const CardWrapper = block.link ? Link : "div";
  const cardProps = block.link ? { href: block.link } : {};

  return (
    <CardWrapper {...cardProps} className={block.className}>
      <Card className={block.link ? "transition-all hover:shadow-lg" : ""}>
        {block.image && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={block.image}
              alt={block.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{block.title}</CardTitle>
          <CardDescription>{block.description}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </CardWrapper>
  );
}

