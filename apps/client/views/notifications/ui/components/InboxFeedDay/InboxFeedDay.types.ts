import type { InboxItem } from '@otmetki/schemas';

import type { InboxDay } from '../../../lib/group-by-day';

export type InboxFeedDayProps = {
  day: InboxDay;
  onSelect: (item: InboxItem) => void;
};
