import type { InboxItem } from '@bronevik/schemas';

import { format, parseISO } from 'date-fns';

import type { InboxDay } from './group-by-day.types';

const DAY_KEY = 'yyyy-MM-dd';

export const groupInboxByDay = (items: InboxItem[]): InboxDay[] =>
  items.reduce<InboxDay[]>((days, item) => {
    const date = parseISO(item.createdAt);
    const key = format(date, DAY_KEY);
    const last = days.at(-1);
    const unread = item.readAt === null ? 1 : 0;

    if (last?.key === key) {
      last.items.push(item);
      last.unread += unread;

      return days;
    }

    return [...days, { key, date, items: [item], unread }];
  }, []);
