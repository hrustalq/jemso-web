/**
 * Block-based Page Builder Types
 * 
 * Defines the structure for a WordPress-like block editor
 * with support for custom design system components
 */

import { z } from "zod";

/**
 * Available block types
 */
export const BLOCK_TYPES = {
  // Basic Content Blocks
  PARAGRAPH: "paragraph",
  HEADING: "heading",
  LIST: "list",
  QUOTE: "quote",
  CODE: "code",
  
  // Media Blocks
  IMAGE: "image",
  VIDEO: "video",
  EMBED: "embed",
  GALLERY: "gallery",
  
  // Rich Content Blocks
  CALLOUT: "callout",
  ALERT: "alert",
  TABS: "tabs",
  ACCORDION: "accordion",
  
  // Layout Blocks
  COLUMNS: "columns",
  SEPARATOR: "separator",
  SPACER: "spacer",
  
  // Custom Component Blocks
  CTA: "cta",
  CARD: "card",
  STATS: "stats",
  TESTIMONIAL: "testimonial",
  
  // Advanced Blocks
  TABLE: "table",
  BUTTON: "button",
  HTML: "html",
} as const;

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];

/**
 * Base block interface - all blocks extend this
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

/**
 * Paragraph block
 */
export const paragraphBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.PARAGRAPH),
  order: z.number(),
  content: z.string(),
  alignment: z.enum(["left", "center", "right", "justify"]).optional(),
  className: z.string().optional(),
});

export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;

/**
 * Heading block (h1-h6)
 */
export const headingBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.HEADING),
  order: z.number(),
  content: z.string(),
  level: z.enum(["1", "2", "3", "4", "5", "6"]),
  alignment: z.enum(["left", "center", "right"]).optional(),
  className: z.string().optional(),
});

export type HeadingBlock = z.infer<typeof headingBlockSchema>;

/**
 * List block (ordered/unordered)
 */
export const listBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.LIST),
  order: z.number(),
  items: z.array(z.string()),
  listType: z.enum(["ordered", "unordered"]),
  className: z.string().optional(),
});

export type ListBlock = z.infer<typeof listBlockSchema>;

/**
 * Quote block
 */
export const quoteBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.QUOTE),
  order: z.number(),
  content: z.string(),
  author: z.string().optional(),
  citation: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  className: z.string().optional(),
});

export type QuoteBlock = z.infer<typeof quoteBlockSchema>;

/**
 * Code block
 */
export const codeBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.CODE),
  order: z.number(),
  code: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
  className: z.string().optional(),
});

export type CodeBlock = z.infer<typeof codeBlockSchema>;

/**
 * Image block
 */
export const imageBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.IMAGE),
  order: z.number(),
  src: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  alignment: z.enum(["left", "center", "right", "wide", "full"]).optional(),
  className: z.string().optional(),
});

export type ImageBlock = z.infer<typeof imageBlockSchema>;

/**
 * Video block
 */
export const videoBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.VIDEO),
  order: z.number(),
  src: z.string().url(),
  caption: z.string().optional(),
  autoplay: z.boolean().optional(),
  controls: z.boolean().optional(),
  loop: z.boolean().optional(),
  className: z.string().optional(),
});

export type VideoBlock = z.infer<typeof videoBlockSchema>;

/**
 * Embed block (YouTube, Twitter, etc.)
 */
export const embedBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.EMBED),
  order: z.number(),
  url: z.string().url(),
  provider: z.enum(["youtube", "vimeo", "twitter", "instagram", "codepen", "other"]),
  caption: z.string().optional(),
  aspectRatio: z.string().optional(), // e.g., "16/9"
  className: z.string().optional(),
});

export type EmbedBlock = z.infer<typeof embedBlockSchema>;

/**
 * Gallery block
 */
export const galleryBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.GALLERY),
  order: z.number(),
  images: z.array(
    z.object({
      src: z.string().url(),
      alt: z.string(),
      caption: z.string().optional(),
    })
  ),
  columns: z.number().min(1).max(6).optional(),
  caption: z.string().optional(),
  className: z.string().optional(),
});

export type GalleryBlock = z.infer<typeof galleryBlockSchema>;

/**
 * Callout block
 */
export const calloutBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.CALLOUT),
  order: z.number(),
  content: z.string(),
  title: z.string().optional(),
  variant: z.enum(["default", "info", "success", "warning", "danger"]).optional(),
  icon: z.string().optional(),
  className: z.string().optional(),
});

export type CalloutBlock = z.infer<typeof calloutBlockSchema>;

/**
 * Alert block
 */
export const alertBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.ALERT),
  order: z.number(),
  content: z.string(),
  title: z.string().optional(),
  variant: z.enum(["default", "destructive"]).optional(),
  className: z.string().optional(),
});

export type AlertBlock = z.infer<typeof alertBlockSchema>;

/**
 * Tabs block
 */
export const tabsBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.TABS),
  order: z.number(),
  tabs: z.array(
    z.object({
      label: z.string(),
      content: z.string(),
    })
  ),
  className: z.string().optional(),
});

export type TabsBlock = z.infer<typeof tabsBlockSchema>;

/**
 * Accordion block
 */
export const accordionBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.ACCORDION),
  order: z.number(),
  items: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  className: z.string().optional(),
});

export type AccordionBlock = z.infer<typeof accordionBlockSchema>;

/**
 * Columns block (layout)
 */
export const columnsBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.COLUMNS),
  order: z.number(),
  columns: z.array(
    z.object({
      width: z.string().optional(), // e.g., "50%", "1fr"
      content: z.string(),
    })
  ),
  gap: z.string().optional(), // e.g., "1rem", "20px"
  className: z.string().optional(),
});

export type ColumnsBlock = z.infer<typeof columnsBlockSchema>;

/**
 * Separator block
 */
export const separatorBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.SEPARATOR),
  order: z.number(),
  style: z.enum(["solid", "dashed", "dotted"]).optional(),
  className: z.string().optional(),
});

export type SeparatorBlock = z.infer<typeof separatorBlockSchema>;

/**
 * Spacer block
 */
export const spacerBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.SPACER),
  order: z.number(),
  height: z.string(), // e.g., "2rem", "40px"
  className: z.string().optional(),
});

export type SpacerBlock = z.infer<typeof spacerBlockSchema>;

/**
 * CTA (Call to Action) block
 */
export const ctaBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.CTA),
  order: z.number(),
  title: z.string(),
  description: z.string().optional(),
  buttonText: z.string(),
  buttonUrl: z.string(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  variant: z.enum(["default", "primary", "secondary", "outline"]).optional(),
  className: z.string().optional(),
});

export type CTABlock = z.infer<typeof ctaBlockSchema>;

/**
 * Card block
 */
export const cardBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.CARD),
  order: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
  link: z.string().optional(),
  className: z.string().optional(),
});

export type CardBlock = z.infer<typeof cardBlockSchema>;

/**
 * Stats block
 */
export const statsBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.STATS),
  order: z.number(),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      description: z.string().optional(),
    })
  ),
  columns: z.number().min(1).max(4).optional(),
  className: z.string().optional(),
});

export type StatsBlock = z.infer<typeof statsBlockSchema>;

/**
 * Testimonial block
 */
export const testimonialBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.TESTIMONIAL),
  order: z.number(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  avatar: z.string().url().optional(),
  className: z.string().optional(),
});

export type TestimonialBlock = z.infer<typeof testimonialBlockSchema>;

/**
 * Table block
 */
export const tableBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.TABLE),
  order: z.number(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional(),
  className: z.string().optional(),
});

export type TableBlock = z.infer<typeof tableBlockSchema>;

/**
 * Button block
 */
export const buttonBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.BUTTON),
  order: z.number(),
  text: z.string(),
  url: z.string(),
  variant: z.enum(["default", "destructive", "outline", "secondary", "ghost", "link"]).optional(),
  size: z.enum(["default", "sm", "lg", "icon"]).optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  className: z.string().optional(),
});

export type ButtonBlock = z.infer<typeof buttonBlockSchema>;

/**
 * HTML block (for custom HTML)
 */
export const htmlBlockSchema = z.object({
  id: z.string(),
  type: z.literal(BLOCK_TYPES.HTML),
  order: z.number(),
  html: z.string(),
  className: z.string().optional(),
});

export type HTMLBlock = z.infer<typeof htmlBlockSchema>;

/**
 * Union of all block types
 */
export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | EmbedBlock
  | GalleryBlock
  | CalloutBlock
  | AlertBlock
  | TabsBlock
  | AccordionBlock
  | ColumnsBlock
  | SeparatorBlock
  | SpacerBlock
  | CTABlock
  | CardBlock
  | StatsBlock
  | TestimonialBlock
  | TableBlock
  | ButtonBlock
  | HTMLBlock;

/**
 * Zod schema for validating any block
 */
export const blockSchema = z.discriminatedUnion("type", [
  paragraphBlockSchema,
  headingBlockSchema,
  listBlockSchema,
  quoteBlockSchema,
  codeBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  embedBlockSchema,
  galleryBlockSchema,
  calloutBlockSchema,
  alertBlockSchema,
  tabsBlockSchema,
  accordionBlockSchema,
  columnsBlockSchema,
  separatorBlockSchema,
  spacerBlockSchema,
  ctaBlockSchema,
  cardBlockSchema,
  statsBlockSchema,
  testimonialBlockSchema,
  tableBlockSchema,
  buttonBlockSchema,
  htmlBlockSchema,
]);

/**
 * Schema for an array of blocks
 */
export const blocksArraySchema = z.array(blockSchema);

/**
 * Post content structure
 */
export const postContentSchema = z.object({
  version: z.string().default("1.0"),
  blocks: blocksArraySchema,
});

export type PostContent = z.infer<typeof postContentSchema>;

