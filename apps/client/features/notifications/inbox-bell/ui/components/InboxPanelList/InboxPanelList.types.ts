import type { InboxItem } from '@bronevik/schemas';

export type InboxPanelListProps = {
  items: InboxItem[];
  isPending: boolean;
  isError: boolean;
  onSelect: (item: InboxItem) => void;
};
