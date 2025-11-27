# Page Builder Documentation

## Overview

A powerful WordPress-like block editor integrated with your design system for creating beautiful, structured blog content. The page builder supports 23+ different block types including text, media, layouts, and custom components.

## Features

### ✅ Block-Based Content
- **23+ Block Types**: Paragraph, heading, list, quote, code, image, video, embed, gallery, callout, alert, tabs, accordion, columns, separator, spacer, CTA, card, stats, testimonial, table, button, and HTML
- **Drag-and-Drop Reordering**: Easily rearrange blocks
- **Block Duplication**: Quick content creation
- **Undo/Redo Support**: Coming soon

### ✅ Rich Editor Features
- **Real-Time Preview**: See exactly how content will look
- **Auto-Save**: Draft content is saved automatically
- **SEO-Friendly**: Auto-generated excerpts and slugs
- **Responsive Design**: All blocks are mobile-optimized
- **Dark Mode Support**: Works seamlessly with your theme

### ✅ Design System Integration
- Uses shadcn/ui components throughout
- Consistent with your application's design
- Fully customizable block styles
- Typography system integration

### ✅ Backward Compatibility
- Legacy HTML content still renders correctly
- Seamless migration path from HTML to blocks
- No breaking changes to existing posts

## Architecture

### Database Schema

```prisma
model BlogPost {
  // ... other fields
  content String   // Legacy HTML content
  blocks  Json?    // New structured block content
}
```

The `blocks` field stores structured JSON data:

```json
{
  "version": "1.0",
  "blocks": [
    {
      "id": "unique-id",
      "type": "paragraph",
      "order": 0,
      "content": "Your content here"
    }
  ]
}
```

### File Structure

```
web/
├── src/
│   ├── lib/blocks/
│   │   ├── types.ts              # Block type definitions & schemas
│   │   └── utils.ts              # Utility functions for blocks
│   │
│   ├── components/blocks/
│   │   ├── block-renderer.tsx    # Main renderer component
│   │   ├── block-editor.tsx      # Editor with drag-and-drop
│   │   ├── block-editor-item.tsx # Individual block wrapper
│   │   ├── block-picker.tsx      # Block selection dialog
│   │   ├── sortable-block-item.tsx # DnD sortable item
│   │   └── renderers/            # Individual block renderers
│   │       ├── paragraph-block.tsx
│   │       ├── heading-block.tsx
│   │       ├── image-block.tsx
│   │       └── ... (20+ more)
│   │
│   ├── app/admin/posts/
│   │   ├── page.tsx              # Posts list
│   │   ├── new/page.tsx          # Create new post
│   │   ├── [id]/edit/page.tsx    # Edit existing post
│   │   └── _components/
│   │       └── post-editor-form.tsx # Main editor form
│   │
│   └── app/blog/[slug]/page.tsx  # Updated to render blocks
```

## Block Types

### Content Blocks

#### Paragraph
Basic text paragraph with alignment options.

```typescript
{
  type: "paragraph",
  content: "<p>Your text here</p>",
  alignment: "left" | "center" | "right" | "justify"
}
```

#### Heading (H1-H6)
Section headings with 6 levels.

```typescript
{
  type: "heading",
  content: "Your heading",
  level: "1" | "2" | "3" | "4" | "5" | "6",
  alignment: "left" | "center" | "right"
}
```

#### List
Ordered or unordered lists.

```typescript
{
  type: "list",
  items: ["Item 1", "Item 2"],
  listType: "ordered" | "unordered"
}
```

#### Quote
Blockquote with optional author and citation.

```typescript
{
  type: "quote",
  content: "Quote text",
  author?: "Author name",
  citation?: "Source"
}
```

#### Code
Code block with syntax highlighting.

```typescript
{
  type: "code",
  code: "const x = 42;",
  language?: "typescript" | "javascript" | "python" | ...,
  filename?: "example.ts",
  showLineNumbers?: boolean
}
```

### Media Blocks

#### Image
Single image with caption and alignment.

```typescript
{
  type: "image",
  src: "https://...",
  alt: "Description",
  caption?: "Image caption",
  alignment: "left" | "center" | "right" | "wide" | "full"
}
```

#### Video
Video player with controls.

```typescript
{
  type: "video",
  src: "https://...",
  caption?: "Video caption",
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean
}
```

#### Embed
Embed YouTube, Vimeo, Twitter, etc.

```typescript
{
  type: "embed",
  url: "https://youtube.com/...",
  provider: "youtube" | "vimeo" | "twitter" | ...,
  aspectRatio?: "16/9"
}
```

#### Gallery
Image gallery grid.

```typescript
{
  type: "gallery",
  images: [
    { src: "https://...", alt: "...", caption?: "..." }
  ],
  columns: 1 | 2 | 3 | 4 | 5 | 6
}
```

### Design Blocks

#### Callout
Highlighted information box.

```typescript
{
  type: "callout",
  content: "Important information",
  title?: "Note",
  variant: "default" | "info" | "success" | "warning" | "danger"
}
```

#### Alert
Alert message using shadcn Alert component.

```typescript
{
  type: "alert",
  content: "Alert message",
  title?: "Alert",
  variant: "default" | "destructive"
}
```

#### Tabs
Tabbed content sections.

```typescript
{
  type: "tabs",
  tabs: [
    { label: "Tab 1", content: "Content 1" },
    { label: "Tab 2", content: "Content 2" }
  ]
}
```

#### Accordion
Collapsible accordion items.

```typescript
{
  type: "accordion",
  items: [
    { title: "Question 1", content: "Answer 1" }
  ]
}
```

#### CTA (Call to Action)
Prominent call-to-action section.

```typescript
{
  type: "cta",
  title: "Get Started Today",
  description?: "Join thousands of users",
  buttonText: "Sign Up",
  buttonUrl: "/signup",
  variant: "default" | "primary" | "secondary" | "outline"
}
```

#### Card
Content card with optional image and link.

```typescript
{
  type: "card",
  title: "Card Title",
  description: "Card description",
  image?: "https://...",
  link?: "/page"
}
```

#### Stats
Statistics display grid.

```typescript
{
  type: "stats",
  stats: [
    { label: "Users", value: "10,000", description?: "Active users" }
  ],
  columns: 1 | 2 | 3 | 4
}
```

#### Testimonial
Customer testimonial with avatar.

```typescript
{
  type: "testimonial",
  quote: "Great product!",
  author: "John Doe",
  role?: "CEO at Company",
  avatar?: "https://..."
}
```

#### Button
Standalone button with link.

```typescript
{
  type: "button",
  text: "Click me",
  url: "/page",
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
  size: "default" | "sm" | "lg" | "icon",
  alignment: "left" | "center" | "right"
}
```

### Layout Blocks

#### Columns
Multi-column layout.

```typescript
{
  type: "columns",
  columns: [
    { width?: "50%", content: "Column 1" },
    { width?: "50%", content: "Column 2" }
  ],
  gap?: "1rem"
}
```

#### Separator
Horizontal divider line.

```typescript
{
  type: "separator",
  style: "solid" | "dashed" | "dotted"
}
```

#### Spacer
Vertical spacing.

```typescript
{
  type: "spacer",
  height: "2rem" | "40px" | "4rem"
}
```

### Advanced Blocks

#### Table
Data table.

```typescript
{
  type: "table",
  headers: ["Header 1", "Header 2"],
  rows: [
    ["Cell 1", "Cell 2"],
    ["Cell 3", "Cell 4"]
  ],
  caption?: "Table caption"
}
```

#### HTML
Custom HTML code.

```typescript
{
  type: "html",
  html: "<div>Custom HTML</div>"
}
```

## Usage

### Creating a New Post

1. Navigate to `/admin/posts/new`
2. Enter a title (slug auto-generates)
3. Click "Add Block" to start building content
4. Choose from 23+ block types
5. Configure each block's properties
6. Drag blocks to reorder
7. Set SEO metadata (excerpt, cover image)
8. Publish when ready

### Editing Existing Posts

1. Navigate to `/admin/posts/[id]/edit`
2. Modify title, blocks, or metadata
3. Drag blocks to reorder
4. Duplicate blocks for quick content creation
5. Delete unwanted blocks
6. Update post

### Block Operations

#### Adding Blocks
- Click "+ Add Block" button at bottom
- Or click "Add Block Below" in block menu
- Select block type from picker
- Configure block properties

#### Reordering Blocks
- Hover over block to reveal drag handle
- Drag block up or down to new position
- Or use up/down arrows in block toolbar

#### Editing Blocks
- Click into any block to edit
- Changes are immediate
- No manual save needed per block

#### Duplicating Blocks
- Open block menu (⋮)
- Click "Duplicate"
- New block appears below

#### Deleting Blocks
- Open block menu (⋮)
- Click "Delete"
- Confirm deletion

### Keyboard Shortcuts

Coming soon:
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + D` - Duplicate block
- `Backspace` - Delete empty block

## API Integration

### Creating Posts with Blocks

```typescript
const createPost = await api.blog.posts.create.mutate({
  title: "My Post",
  slug: "my-post",
  blocks: [
    {
      id: "1",
      type: "heading",
      order: 0,
      content: "Welcome",
      level: "1"
    },
    {
      id: "2",
      type: "paragraph",
      order: 1,
      content: "This is my first paragraph."
    }
  ],
  published: true
});
```

### Updating Posts

```typescript
const updatePost = await api.blog.posts.update.mutate({
  id: "post-id",
  blocks: [
    // Updated blocks array
  ]
});
```

### Rendering Blocks

```tsx
import { BlocksRenderer } from "~/components/blocks/block-renderer";

<BlocksRenderer blocks={post.blocks} />
```

## Migration Guide

### From HTML to Blocks

The system supports both HTML content and block content:

1. **New posts**: Use the block editor
2. **Existing posts**: Continue to render HTML
3. **Migration**: Edit old posts to convert to blocks

### Converting HTML to Blocks

Use the provided utility:

```typescript
import { htmlToBlocks } from "~/lib/blocks/utils";

const blocks = htmlToBlocks(htmlContent);
```

Note: This is a basic converter. Manual adjustment may be needed.

## Customization

### Creating Custom Blocks

1. Define block type in `src/lib/blocks/types.ts`
2. Add schema validation
3. Create renderer in `src/components/blocks/renderers/`
4. Add to block picker categories
5. Update block metadata

Example:

```typescript
// 1. Define type
export const customBlockSchema = z.object({
  id: z.string(),
  type: z.literal("custom"),
  order: z.number(),
  customField: z.string(),
});

export type CustomBlock = z.infer<typeof customBlockSchema>;

// 2. Create renderer
export default function CustomBlockComponent({ block }: { block: CustomBlock }) {
  return <div>{block.customField}</div>;
}

// 3. Add to metadata
export const BLOCK_METADATA = {
  // ... existing blocks
  custom: {
    label: "Custom Block",
    icon: "🎨",
    category: "design",
    description: "My custom block"
  }
};
```

### Styling Blocks

All blocks use your existing design system:

- Colors from `globals.css`
- Components from `shadcn/ui`
- Typography from Tailwind config
- Dark mode support built-in

## Performance

### Optimization Strategies

1. **Dynamic Imports**: Block renderers are loaded on-demand
2. **Image Optimization**: Uses Next.js Image component
3. **Code Splitting**: Editor UI separate from renderer
4. **Lazy Loading**: Blocks load progressively

### Best Practices

- Keep block count reasonable (< 100 per post)
- Optimize images before uploading
- Use native blocks over custom HTML
- Enable caching for published posts

## Accessibility

All blocks are built with accessibility in mind:

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- High contrast support

## Security

- XSS protection via React
- Content sanitization
- Permission-based editing
- RBAC integration
- Safe HTML rendering

## Troubleshooting

### Blocks Not Rendering

1. Check if `blocks` field exists in post data
2. Verify blocks array is valid JSON
3. Check console for errors
4. Ensure block types are supported

### Editor Not Loading

1. Check browser console for errors
2. Verify all dependencies installed
3. Check if user has create/edit permissions
4. Try clearing browser cache

### Drag-and-Drop Not Working

1. Ensure pointer events are enabled
2. Check if blocks have unique IDs
3. Verify @dnd-kit is installed
4. Try refreshing the page

## Future Enhancements

### Planned Features

- [ ] Block templates
- [ ] Reusable block patterns
- [ ] Block versioning
- [ ] Collaborative editing
- [ ] Block search/replace
- [ ] Import/export blocks
- [ ] Block analytics
- [ ] A/B testing blocks

### Roadmap

**v1.1** (Q1 2025)
- Block templates library
- Keyboard shortcuts
- Undo/redo support

**v1.2** (Q2 2025)
- Collaborative editing
- Block comments
- Version history

**v1.3** (Q3 2025)
- Advanced analytics
- A/B testing
- Performance optimizations

## Resources

- [Blocks Type Definitions](../src/lib/blocks/types.ts)
- [Block Utilities](../src/lib/blocks/utils.ts)
- [Block Renderers](../src/components/blocks/renderers/)
- [Editor Component](../src/components/blocks/block-editor.tsx)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the block type definitions
3. Check existing blog posts for examples
4. Review the code in `src/lib/blocks/` and `src/components/blocks/`

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@dnd-kit](https://dndkit.com/)
- [Zod](https://zod.dev/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)

