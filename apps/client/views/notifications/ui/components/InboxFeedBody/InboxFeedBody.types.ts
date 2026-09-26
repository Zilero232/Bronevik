import type { InboxItem } from '@bronevik/schemas';

import type { InboxDay } from '../../../lib/group-by-day';
import type { InboxFeedFilter } from '../../../model/notifications.types';

export type InboxFeedBodyProps = {
  days: InboxDay[];
  filter: InboxFeedFilter;
  isEmpty: boolean;
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  onSelect: (item: InboxItem) => void;
};
