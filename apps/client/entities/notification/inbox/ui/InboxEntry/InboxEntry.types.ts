import type { InboxItem } from '@bronevik/schemas';

export type InboxEntryProps = {
  item: InboxItem;
  density?: 'compact' | 'full';
  className?: string;
  onSelect?: (item: InboxItem) => void;
};
