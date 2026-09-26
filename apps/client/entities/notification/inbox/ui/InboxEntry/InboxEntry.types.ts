import type { InboxItem } from '@otmetki/schemas';

export type InboxEntryProps = {
  item: InboxItem;
  density?: 'compact' | 'full';
  className?: string;
  onSelect?: (item: InboxItem) => void;
};
