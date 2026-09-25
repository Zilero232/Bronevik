import type { InboxFeedFilter } from '../../../model/notifications.types';

export type InboxFeedHeaderProps = {
  filter: InboxFeedFilter;
  unread: number;
  onFilterChange: (filter: InboxFeedFilter) => void;
  onMarkAll: () => void;
};
