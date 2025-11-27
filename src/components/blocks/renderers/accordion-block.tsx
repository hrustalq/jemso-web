"use client";

import type { AccordionBlock } from "~/lib/blocks/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface AccordionBlockProps {
  block: AccordionBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<AccordionBlock>) => void;
}

export default function AccordionBlockComponent({ block }: AccordionBlockProps) {
  return (
    <Accordion type="single" collapsible className={block.className}>
      {block.items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

