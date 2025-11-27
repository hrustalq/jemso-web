import type { StatsBlock } from "~/lib/blocks/types";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface StatsBlockProps {
  block: StatsBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<StatsBlock>) => void;
}

export default function StatsBlockComponent({ block }: StatsBlockProps) {
  const columns = block.columns ?? 3;

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        block.className
      )}
    >
      {block.stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

