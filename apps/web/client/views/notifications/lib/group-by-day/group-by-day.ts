import type { InboxItem } from '@otmetki/schemas';

import { parseISO } from 'date-fns';
import { entries, groupBy, pipe } from 'remeda';

import { dayKey } from '@/shared/lib';

import type { InboxDay } from './group-by-day.types';

export const groupInboxByDay = (items: InboxItem[]): InboxDay[] =>
  pipe(
    items,
    groupBy(({ createdAt }) => dayKey({ date: createdAt })),
    entries(),
    (days) =>
      days.map(([key, dayItems]) => ({
        key,
        date: parseISO(dayItems[0].createdAt),
        items: dayItems,
        unread: dayItems.filter(({ readAt }) => readAt === null).length
      }))
  );
