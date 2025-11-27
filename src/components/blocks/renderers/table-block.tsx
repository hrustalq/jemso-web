import type { TableBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";

interface TableBlockProps {
  block: TableBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<TableBlock>) => void;
}

export default function TableBlockComponent({ block }: TableBlockProps) {
  return (
    <div className={cn("overflow-x-auto", block.className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {block.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-semibold bg-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption && (
        <div className="mt-2 text-sm text-muted-foreground text-center">
          {block.caption}
        </div>
      )}
    </div>
  );
}

