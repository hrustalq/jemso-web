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
  };

  switch (block.type) {
    case BLOCK_TYPES.PARAGRAPH:
      return <ParagraphBlock {...commonProps} />;
    
    case BLOCK_TYPES.HEADING:
      return <HeadingBlock {...commonProps} />;
    
    case BLOCK_TYPES.LIST:
      return <ListBlock {...commonProps} />;
    
    case BLOCK_TYPES.QUOTE:
      return <QuoteBlock {...commonProps} />;
    
    case BLOCK_TYPES.CODE:
      return <CodeBlock {...commonProps} />;
    
    case BLOCK_TYPES.IMAGE:
      return <ImageBlock {...commonProps} />;
    
    case BLOCK_TYPES.VIDEO:
      return <VideoBlock {...commonProps} />;
    
    case BLOCK_TYPES.EMBED:
      return <EmbedBlock {...commonProps} />;
    
    case BLOCK_TYPES.GALLERY:
      return <GalleryBlock {...commonProps} />;
    
    case BLOCK_TYPES.CALLOUT:
      return <CalloutBlock {...commonProps} />;
    
    case BLOCK_TYPES.ALERT:
      return <AlertBlock {...commonProps} />;
    
    case BLOCK_TYPES.TABS:
      return <TabsBlock {...commonProps} />;
    
    case BLOCK_TYPES.ACCORDION:
      return <AccordionBlock {...commonProps} />;
    
    case BLOCK_TYPES.COLUMNS:
      return <ColumnsBlock {...commonProps} />;
    
    case BLOCK_TYPES.SEPARATOR:
      return <SeparatorBlock {...commonProps} />;
    
    case BLOCK_TYPES.SPACER:
      return <SpacerBlock {...commonProps} />;
    
    case BLOCK_TYPES.CTA:
      return <CTABlock {...commonProps} />;
    
    case BLOCK_TYPES.CARD:
      return <CardBlock {...commonProps} />;
    
    case BLOCK_TYPES.STATS:
      return <StatsBlock {...commonProps} />;
    
    case BLOCK_TYPES.TESTIMONIAL:
      return <TestimonialBlock {...commonProps} />;
    
    case BLOCK_TYPES.TABLE:
      return <TableBlock {...commonProps} />;
    
    case BLOCK_TYPES.BUTTON:
      return <ButtonBlock {...commonProps} />;
    
    case BLOCK_TYPES.HTML:
      return <HTMLBlock {...commonProps} />;
    
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

