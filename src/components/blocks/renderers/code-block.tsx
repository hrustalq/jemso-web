"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CodeBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface CodeBlockProps {
  block: CodeBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<CodeBlock>) => void;
}

export default function CodeBlockComponent({ block }: CodeBlockProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden", block.className)}>
      {block.filename && (
        <div className="bg-muted px-4 py-2 text-sm text-muted-foreground border-b">
          {block.filename}
        </div>
      )}
      <SyntaxHighlighter
        language={block.language ?? "typescript"}
        style={oneDark}
        showLineNumbers={block.showLineNumbers ?? true}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
        }}
      >
        {block.code}
      </SyntaxHighlighter>
    </div>
  );
}

