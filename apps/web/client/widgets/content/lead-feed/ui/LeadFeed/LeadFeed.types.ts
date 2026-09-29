import type { Key, ReactNode } from 'react';

export type LeadFeedProps<Item> = {
  lead: ReactNode;
  items: readonly Item[];
  itemKey: (item: Item) => Key;
  renderItem: (item: Item) => ReactNode;
};
