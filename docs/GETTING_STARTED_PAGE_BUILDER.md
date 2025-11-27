# Getting Started with the Page Builder

## 🎉 What's New

Your blog now has a powerful WordPress-like page builder with **23+ block types** including:

- **Content Blocks**: Paragraph, Heading, List, Quote, Code
- **Media Blocks**: Image, Video, Embed, Gallery  
- **Design Blocks**: Callout, Alert, Tabs, Accordion, CTA, Card, Stats, Testimonial, Button
- **Layout Blocks**: Columns, Separator, Spacer
- **Advanced Blocks**: Table, Custom HTML

## 🚀 Quick Start

### 1. Create Your First Post

Navigate to: `/admin/posts/new`

Or click the "New Post" button in the admin panel.

### 2. Add Blocks

1. Click the "+ Add Block" button
2. Browse or search for a block type
3. Click on a block to add it to your post
4. Configure the block properties

### 3. Build Your Content

- **Type directly** into text blocks
- **Drag blocks** to reorder them
- **Duplicate blocks** for quick content creation
- **Delete blocks** you don't need

### 4. Publish

1. Add a title (slug auto-generates)
2. Set cover image and excerpt
3. Toggle "Published" switch
4. Click "Create Post"

## 📂 Key Files & Locations

### Admin Pages
- **Posts List**: `/admin/posts`
- **Create Post**: `/admin/posts/new`
- **Edit Post**: `/admin/posts/[id]/edit`

### Code Structure
```
src/
├── lib/blocks/
│   ├── types.ts              # Block type definitions
│   └── utils.ts              # Block utilities
│
├── components/blocks/
│   ├── block-renderer.tsx    # Renders blocks on blog
│   ├── block-editor.tsx      # Editor with drag-and-drop
│   ├── block-picker.tsx      # Block selection dialog
│   └── renderers/            # Individual block renderers
│
└── app/
    ├── admin/posts/          # Admin pages
    └── blog/[slug]/          # Blog post display (updated)
```

## 🎨 Block Examples

### Paragraph
Simple text content with alignment options.

### Heading
H1-H6 headings styled with your design system.

### Image
Images with captions, alt text, and alignment (left, center, right, wide, full).

### Code
Syntax-highlighted code blocks with line numbers and file names.

### Callout
Highlighted boxes for important information (info, success, warning, danger).

### CTA
Call-to-action sections with title, description, and button.

### Columns
Multi-column layouts with customizable gap and widths.

### Stats
Display statistics in a grid (perfect for metrics).

### Testimonials
Customer quotes with avatars and roles.

## 🔧 Configuration

### Database Changes

The `BlogPost` model now has a `blocks` field:

```prisma
model BlogPost {
  // ... existing fields
  content String   // Legacy HTML
  blocks  Json?    // New block content
}
```

Already applied via `pnpm prisma db push`.

### API Updates

Create/update post DTOs now accept `blocks`:

```typescript
{
  title: "Post Title",
  slug: "post-slug",
  blocks: [
    { id: "1", type: "heading", order: 0, content: "Hello", level: "1" },
    { id: "2", type: "paragraph", order: 1, content: "World" }
  ],
  published: true
}
```

## 💡 Tips & Best Practices

### Content Structure
- Start with a heading to establish hierarchy
- Use callouts to highlight important info
- Break up long text with images or separators
- Use stats blocks for data visualization

### SEO
- First heading becomes the main title
- Excerpt auto-generates from content
- Add alt text to all images
- Use meaningful slug URLs

### Performance
- Keep blocks count under 100 per post
- Optimize images before uploading
- Use native blocks over custom HTML
- Leverage Next.js Image optimization

### Accessibility
- All blocks are semantic HTML
- Images require alt text
- Headings follow proper hierarchy
- Keyboard navigation supported

## 🔄 Backward Compatibility

**Legacy posts continue to work!**

The system detects if a post uses blocks or HTML:

- **With blocks**: Renders using BlocksRenderer
- **Without blocks**: Renders legacy HTML content
- **Migration**: Edit old posts to convert to blocks

## 📖 Full Documentation

See [docs/PAGE_BUILDER.md](./docs/PAGE_BUILDER.md) for:

- Complete block type reference
- API documentation
- Customization guide
- Advanced features
- Troubleshooting

## 🎯 Next Steps

1. **Create your first post**: `/admin/posts/new`
2. **Explore block types**: Try different blocks
3. **Customize blocks**: Add your own block types
4. **Share feedback**: Report issues or suggest features

## 📚 Additional Resources

- [Authentication Docs](./docs/AUTHENTICATION.md)
- [RBAC & Subscriptions](./docs/RBAC_AND_SUBSCRIPTIONS.md)
- [Database Integration](./docs/DATABASE_INTEGRATION.md)
- [Account Settings](./docs/ACCOUNT_SETTINGS.md)

## 🚦 Current Status

✅ Database schema updated
✅ 23+ block types implemented
✅ Drag-and-drop editor created
✅ Block picker with search
✅ Admin pages for create/edit
✅ Blog display updated
✅ Backward compatibility maintained
✅ Full documentation written

**Ready to use!** Start creating beautiful content with the page builder.

---

**Questions?** Check the main documentation or review the code in `src/lib/blocks/` and `src/components/blocks/`.

