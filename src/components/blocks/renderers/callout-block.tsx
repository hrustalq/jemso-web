import type { CalloutBlock } from "~/lib/blocks/types";
import { cn } from "~/lib/utils";
import { Info, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

interface CalloutBlockProps {
  block: CalloutBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<CalloutBlock>) => void;
}

export default function CalloutBlockComponent({ block }: CalloutBlockProps) {
  const variant = block.variant ?? "default";

  const variantStyles = {
    default: "bg-muted border-muted-foreground/20",
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
    warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900",
    danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  };

  const icons = {
    default: Info,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertCircle,
  };

  const Icon = block.icon ? null : icons[variant];

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variantStyles[variant],
        block.className
      )}
    >
      <div className="flex gap-3">
        {Icon && <Icon className="h-5 w-5 shrink-0 mt-0.5" />}
        <div className="flex-1 space-y-2">
          {block.title && (
            <div className="font-semibold text-foreground">{block.title}</div>
          )}
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      </div>
    </div>
  );
}

