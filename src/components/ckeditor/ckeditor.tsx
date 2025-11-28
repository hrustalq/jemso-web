"use client";

/**
 * CKEditor 5 Wrapper Component
 * 
 * A React wrapper for CKEditor 5 Classic editor with a comprehensive set of features
 * suitable for blog posts, events, and news content management.
 * 
 * Note: CKEditor 5 requires a license key for commercial use.
 * For open-source projects, you can use the GPL license or get a free license key.
 * Set NEXT_PUBLIC_CKEDITOR_LICENSE_KEY in your .env file.
 */

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "~/styles/ckeditor.css";

interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export function CKEditorComponent({
  value,
  onChange,
  placeholder = "Начните вводить текст...",
  disabled = false,
  minHeight = "400px",
  maxHeight = "800px",
}: CKEditorComponentProps) {

  // Get license key from environment variable
  // For open-source GPL projects: get a free GPL license key from https://ckeditor.com/pricing/
  // For commercial projects: purchase a license from https://ckeditor.com/pricing/
  // For development/testing: you can use an empty string (may show warnings)
  const licenseKey = typeof window !== "undefined" 
    ? process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY ?? ""
    : "";

  const editorConfiguration = {
    // License key for CKEditor 5
    // Set NEXT_PUBLIC_CKEDITOR_LICENSE_KEY in your .env file
    // Get a free GPL license: https://ckeditor.com/pricing/
    licenseKey,
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "insertTable",
        "|",
        "imageUpload",
        "mediaEmbed",
        "|",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" } as const,
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" } as const,
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" } as const,
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" } as const,
      ],
    },
    placeholder,
  };

  return (
    <div className="ckeditor-wrapper">
      <style jsx global>{`
        .ckeditor-wrapper .ck-editor {
          min-height: ${minHeight};
        }
        .ckeditor-wrapper .ck-editor__editable {
          min-height: ${minHeight};
          max-height: ${maxHeight};
          overflow-y: auto;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        disabled={disabled}
        onChange={(_event: unknown, editor: { getData: () => string }) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}

