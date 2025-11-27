/**
 * Block Renderer
 * 
 * Renders individual blocks based on their type
 */

import dynamic from "next/dynamic";
import type { Block } from "~/lib/blocks/types";
import { BLOCK_TYPES } from "~/lib/blocks/types";

// Dynamically import specific block renderers
const ParagraphBlock = dynamic(() => import("./renderers/paragraph-block"));
const HeadingBlock = dynamic(() => import("./renderers/heading-block"));
const ListBlock = dynamic(() => import("./renderers/list-block"));
const QuoteBlock = dynamic(() => import("./renderers/quote-block"));
const CodeBlock = dynamic(() => import("./renderers/code-block"));
const ImageBlock = dynamic(() => import("./renderers/image-block"));
const VideoBlock = dynamic(() => import("./renderers/video-block"));
const EmbedBlock = dynamic(() => import("./renderers/embed-block"));
const GalleryBlock = dynamic(() => import("./renderers/gallery-block"));
const CalloutBlock = dynamic(() => import("./renderers/callout-block"));
const AlertBlock = dynamic(() => import("./renderers/alert-block"));
const TabsBlock = dynamic(() => import("./renderers/tabs-block"));
const AccordionBlock = dynamic(() => import("./renderers/accordion-block"));
const ColumnsBlock = dynamic(() => import("./renderers/columns-block"));
const SeparatorBlock = dynamic(() => import("./renderers/separator-block"));
const SpacerBlock = dynamic(() => import("./renderers/spacer-block"));
const CTABlock = dynamic(() => import("./renderers/cta-block"));
const CardBlock = dynamic(() => import("./renderers/card-block"));
const StatsBlock = dynamic(() => import("./renderers/stats-block"));
const TestimonialBlock = dynamic(() => import("./renderers/testimonial-block"));
const TableBlock = dynamic(() => import("./renderers/table-block"));
const ButtonBlock = dynamic(() => import("./renderers/button-block"));
const HTMLBlock = dynamic(() => import("./renderers/html-block"));

interface BlockRendererProps {
  block: Block;
  editable?: boolean;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
}

export function BlockRenderer({ block, editable = false, onUpdate }: BlockRendererProps) {
  const commonProps = {
    block,
    editable,
    onUpdate: onUpdate ? (updates: Partial<Block>) => onUpdate(block.id, updates) : undefined,
  } as const;

  switch (block.type) {
    case BLOCK_TYPES.PARAGRAPH:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ParagraphBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.HEADING:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <HeadingBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.LIST:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ListBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.QUOTE:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <QuoteBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.CODE:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CodeBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.IMAGE:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ImageBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.VIDEO:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <VideoBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.EMBED:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <EmbedBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.GALLERY:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <GalleryBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.CALLOUT:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CalloutBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.ALERT:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <AlertBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.TABS:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TabsBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.ACCORDION:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <AccordionBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.COLUMNS:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ColumnsBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.SEPARATOR:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <SeparatorBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.SPACER:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <SpacerBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.CTA:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CTABlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.CARD:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CardBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.STATS:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <StatsBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.TESTIMONIAL:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TestimonialBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.TABLE:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <TableBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.BUTTON:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ButtonBlock {...(commonProps as any)} />;
    
    case BLOCK_TYPES.HTML:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <HTMLBlock {...(commonProps as any)} />;
    
    default:
      return (
        <div className="rounded-md border border-dashed border-muted-foreground/25 p-4 text-center text-sm text-muted-foreground">
          Unknown block type: {(block as Block).type}
        </div>
      );
  }
}

interface BlocksRendererProps {
  blocks: Block[];
  editable?: boolean;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
}

/**
 * Renders an array of blocks
 */
export function BlocksRenderer({ blocks, editable = false, onUpdate }: BlocksRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedBlocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          editable={editable}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

