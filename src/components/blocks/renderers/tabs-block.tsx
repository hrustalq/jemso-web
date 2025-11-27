"use client";

import type { TabsBlock } from "~/lib/blocks/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface TabsBlockProps {
  block: TabsBlock;
  editable?: boolean;
  onUpdate?: (updates: Partial<TabsBlock>) => void;
}

export default function TabsBlockComponent({ block }: TabsBlockProps) {
  return (
    <Tabs defaultValue={`tab-0`} className={block.className}>
      <TabsList>
        {block.tabs.map((tab, index) => (
          <TabsTrigger key={index} value={`tab-${index}`}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {block.tabs.map((tab, index) => (
        <TabsContent key={index} value={`tab-${index}`}>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: tab.content }}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

