/**
 * Block utility functions
 */

import { nanoid } from "nanoid";
import type { Block, BlockType, PostContent } from "./types";
import { BLOCK_TYPES } from "./types";

/**
 * Generate a unique block ID
 */
export function generateBlockId(): string {
  return nanoid();
}

/**
 * Create a new empty block of the specified type
 */
export function createEmptyBlock(type: BlockType, order: number): Block {
  const id = generateBlockId();

  switch (type) {
    case BLOCK_TYPES.PARAGRAPH:
      return { id, type, order, content: "", alignment: "left" };
    
    case BLOCK_TYPES.HEADING:
      return { id, type, order, content: "", level: "2", alignment: "left" };
    
    case BLOCK_TYPES.LIST:
      return { id, type, order, items: [""], listType: "unordered" };
    
    case BLOCK_TYPES.QUOTE:
      return { id, type, order, content: "", alignment: "left" };
    
    case BLOCK_TYPES.CODE:
      return { id, type, order, code: "", language: "typescript", showLineNumbers: true };
    
    case BLOCK_TYPES.IMAGE:
      return { id, type, order, src: "", alt: "", alignment: "center" };
    
    case BLOCK_TYPES.VIDEO:
      return { id, type, order, src: "", controls: true, autoplay: false, loop: false };
    
    case BLOCK_TYPES.EMBED:
      return { id, type, order, url: "", provider: "youtube", aspectRatio: "16/9" };
    
    case BLOCK_TYPES.GALLERY:
      return { id, type, order, images: [], columns: 3 };
    
    case BLOCK_TYPES.CALLOUT:
      return { id, type, order, content: "", variant: "default" };
    
    case BLOCK_TYPES.ALERT:
      return { id, type, order, content: "", variant: "default" };
    
    case BLOCK_TYPES.TABS:
      return { id, type, order, tabs: [{ label: "Tab 1", content: "" }] };
    
    case BLOCK_TYPES.ACCORDION:
      return { id, type, order, items: [{ title: "Item 1", content: "" }] };
    
    case BLOCK_TYPES.COLUMNS:
      return { id, type, order, columns: [{ content: "" }, { content: "" }], gap: "1rem" };
    
    case BLOCK_TYPES.SEPARATOR:
      return { id, type, order, style: "solid" };
    
    case BLOCK_TYPES.SPACER:
      return { id, type, order, height: "2rem" };
    
    case BLOCK_TYPES.CTA:
      return {
        id,
        type,
        order,
        title: "",
        buttonText: "Learn More",
        buttonUrl: "#",
        alignment: "center",
        variant: "default",
      };
    
    case BLOCK_TYPES.CARD:
      return { id, type, order, title: "", description: "" };
    
    case BLOCK_TYPES.STATS:
      return {
        id,
        type,
        order,
        stats: [{ label: "Stat 1", value: "0" }],
        columns: 3,
      };
    
    case BLOCK_TYPES.TESTIMONIAL:
      return { id, type, order, quote: "", author: "" };
    
    case BLOCK_TYPES.TABLE:
      return {
        id,
        type,
        order,
        headers: ["Header 1", "Header 2"],
        rows: [["Cell 1", "Cell 2"]],
      };
    
    case BLOCK_TYPES.BUTTON:
      return {
        id,
        type,
        order,
        text: "Click me",
        url: "#",
        variant: "default",
        size: "default",
        alignment: "left",
      };
    
    case BLOCK_TYPES.HTML:
      return { id, type, order, html: "" };
    
    default:
      // This should never happen if all cases are handled
      return { id, type: BLOCK_TYPES.PARAGRAPH, order, content: "" };
  }
}

/**
 * Reorder blocks after a drag-and-drop operation
 */
export function reorderBlocks(blocks: Block[], fromIndex: number, toIndex: number): Block[] {
  const result = Array.from(blocks);
  const [removed] = result.splice(fromIndex, 1);
  if (removed) {
    result.splice(toIndex, 0, removed);
  }

  // Update order property for all blocks
  return result.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * Insert a new block at a specific position
 */
export function insertBlock(blocks: Block[], newBlock: Block, position: number): Block[] {
  const result = [...blocks];
  result.splice(position, 0, newBlock);

  // Update order property for all blocks
  return result.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * Remove a block by ID
 */
export function removeBlock(blocks: Block[], blockId: string): Block[] {
  const filtered = blocks.filter((block) => block.id !== blockId);

  // Update order property for remaining blocks
  return filtered.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * Update a block by ID
 */
export function updateBlock(blocks: Block[], blockId: string, updates: Partial<Block>): Block[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, ...updates } as Block : block
  );
}

/**
 * Duplicate a block
 */
export function duplicateBlock(blocks: Block[], blockId: string): Block[] {
  const blockIndex = blocks.findIndex((b) => b.id === blockId);
  if (blockIndex === -1) return blocks;

  const blockToDuplicate = blocks[blockIndex];
  if (!blockToDuplicate) return blocks;

  const duplicated = {
    ...blockToDuplicate,
    id: generateBlockId(),
  };

  return insertBlock(blocks, duplicated as Block, blockIndex + 1);
}

/**
 * Convert blocks to plain text (for excerpt generation)
 */
export function blocksToPlainText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case BLOCK_TYPES.PARAGRAPH:
        case BLOCK_TYPES.HEADING:
          return block.content;
        
        case BLOCK_TYPES.LIST:
          return block.items.join(" ");
        
        case BLOCK_TYPES.QUOTE:
          return block.content;
        
        case BLOCK_TYPES.CODE:
          return block.code;
        
        case BLOCK_TYPES.CALLOUT:
        case BLOCK_TYPES.ALERT:
          return `${block.title ? block.title + " " : ""}${block.content}`;
        
        case BLOCK_TYPES.CTA:
          return `${block.title} ${block.description ?? ""} ${block.buttonText}`;
        
        case BLOCK_TYPES.CARD:
          return `${block.title} ${block.description}`;
        
        case BLOCK_TYPES.TESTIMONIAL:
          return `${block.quote} - ${block.author}`;
        
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Generate an excerpt from blocks
 */
export function generateExcerpt(blocks: Block[], maxLength = 160): string {
  const text = blocksToPlainText(blocks);
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Validate post content structure
 */
export function isValidPostContent(content: unknown): content is PostContent {
  if (!content || typeof content !== "object") return false;
  
  const obj = content as Record<string, unknown>;
  return (
    typeof obj.version === "string" &&
    Array.isArray(obj.blocks)
  );
}

/**
 * Create empty post content
 */
export function createEmptyPostContent(): PostContent {
  return {
    version: "1.0",
    blocks: [],
  };
}

/**
 * Convert legacy HTML content to blocks (basic conversion)
 */
export function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  let order = 0;

  // This is a simple conversion - you might want to use a library like jsdom for more complex HTML
  const lines = html.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) continue;

    // Check for headings
    const headingMatch = /^<h([1-6])>(.*)<\/h\1>$/.exec(trimmed);
    if (headingMatch?.[1] && headingMatch[2]) {
      blocks.push({
        id: generateBlockId(),
        type: BLOCK_TYPES.HEADING,
        order: order++,
        content: headingMatch[2],
        level: headingMatch[1] as "1" | "2" | "3" | "4" | "5" | "6",
      });
      continue;
    }

    // Check for paragraphs
    const paragraphMatch = /^<p>(.*)<\/p>$/.exec(trimmed);
    if (paragraphMatch?.[1]) {
      blocks.push({
        id: generateBlockId(),
        type: BLOCK_TYPES.PARAGRAPH,
        order: order++,
        content: paragraphMatch[1],
      });
      continue;
    }

    // Default: treat as paragraph
    blocks.push({
      id: generateBlockId(),
      type: BLOCK_TYPES.PARAGRAPH,
      order: order++,
      content: trimmed,
    });
  }

  return blocks;
}

/**
 * Block type metadata for UI
 */
export const BLOCK_METADATA: Record<BlockType, {
  label: string;
  icon: string;
  category: "content" | "media" | "design" | "layout" | "advanced";
  description: string;
}> = {
  [BLOCK_TYPES.PARAGRAPH]: {
    label: "Paragraph",
    icon: "📝",
    category: "content",
    description: "Basic text paragraph",
  },
  [BLOCK_TYPES.HEADING]: {
    label: "Heading",
    icon: "📰",
    category: "content",
    description: "Section heading (H1-H6)",
  },
  [BLOCK_TYPES.LIST]: {
    label: "List",
    icon: "📋",
    category: "content",
    description: "Ordered or unordered list",
  },
  [BLOCK_TYPES.QUOTE]: {
    label: "Quote",
    icon: "💬",
    category: "content",
    description: "Blockquote with citation",
  },
  [BLOCK_TYPES.CODE]: {
    label: "Code",
    icon: "💻",
    category: "content",
    description: "Code block with syntax highlighting",
  },
  [BLOCK_TYPES.IMAGE]: {
    label: "Image",
    icon: "🖼️",
    category: "media",
    description: "Single image with caption",
  },
  [BLOCK_TYPES.VIDEO]: {
    label: "Video",
    icon: "🎥",
    category: "media",
    description: "Video player",
  },
  [BLOCK_TYPES.EMBED]: {
    label: "Embed",
    icon: "🔗",
    category: "media",
    description: "Embed from YouTube, Twitter, etc.",
  },
  [BLOCK_TYPES.GALLERY]: {
    label: "Gallery",
    icon: "🎨",
    category: "media",
    description: "Image gallery grid",
  },
  [BLOCK_TYPES.CALLOUT]: {
    label: "Callout",
    icon: "📢",
    category: "design",
    description: "Highlighted callout box",
  },
  [BLOCK_TYPES.ALERT]: {
    label: "Alert",
    icon: "⚠️",
    category: "design",
    description: "Alert message",
  },
  [BLOCK_TYPES.TABS]: {
    label: "Tabs",
    icon: "📑",
    category: "design",
    description: "Tabbed content",
  },
  [BLOCK_TYPES.ACCORDION]: {
    label: "Accordion",
    icon: "📂",
    category: "design",
    description: "Collapsible accordion",
  },
  [BLOCK_TYPES.COLUMNS]: {
    label: "Columns",
    icon: "▦",
    category: "layout",
    description: "Multi-column layout",
  },
  [BLOCK_TYPES.SEPARATOR]: {
    label: "Separator",
    icon: "—",
    category: "layout",
    description: "Horizontal divider",
  },
  [BLOCK_TYPES.SPACER]: {
    label: "Spacer",
    icon: "⬜",
    category: "layout",
    description: "Vertical spacing",
  },
  [BLOCK_TYPES.CTA]: {
    label: "Call to Action",
    icon: "🎯",
    category: "design",
    description: "CTA section with button",
  },
  [BLOCK_TYPES.CARD]: {
    label: "Card",
    icon: "🃏",
    category: "design",
    description: "Content card",
  },
  [BLOCK_TYPES.STATS]: {
    label: "Stats",
    icon: "📊",
    category: "design",
    description: "Statistics display",
  },
  [BLOCK_TYPES.TESTIMONIAL]: {
    label: "Testimonial",
    icon: "💭",
    category: "design",
    description: "Customer testimonial",
  },
  [BLOCK_TYPES.TABLE]: {
    label: "Table",
    icon: "📅",
    category: "advanced",
    description: "Data table",
  },
  [BLOCK_TYPES.BUTTON]: {
    label: "Button",
    icon: "🔘",
    category: "design",
    description: "Call-to-action button",
  },
  [BLOCK_TYPES.HTML]: {
    label: "Custom HTML",
    icon: "🔧",
    category: "advanced",
    description: "Custom HTML code",
  },
};

