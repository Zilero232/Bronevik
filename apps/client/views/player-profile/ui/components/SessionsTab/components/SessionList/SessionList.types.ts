import type { SessionListItem } from '@bronevik/schemas';

export type SessionListProps = {
  items: SessionListItem[];
  selectedId?: string;
  hasMore: boolean;
  isFetching: boolean;
  onSelect: (id: string) => void;
  onMore: () => void;
};
