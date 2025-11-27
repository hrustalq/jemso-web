import type { AlertBlock } from "~/lib/blocks/types";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface AlertBlockProps {
  block: AlertBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<AlertBlock>) => void;
}

export default function AlertBlockComponent({ block }: AlertBlockProps) {
  return (
    <Alert variant={block.variant} className={block.className}>
      {block.title && <AlertTitle>{block.title}</AlertTitle>}
      <AlertDescription dangerouslySetInnerHTML={{ __html: block.content }} />
    </Alert>
  );
}

