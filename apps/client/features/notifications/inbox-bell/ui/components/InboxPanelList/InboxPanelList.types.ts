import type { InboxItem } from '@otmetki/schemas';

export type InboxPanelListProps = {
  items: InboxItem[];
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  onSelect: (item: InboxItem) => void;
};
