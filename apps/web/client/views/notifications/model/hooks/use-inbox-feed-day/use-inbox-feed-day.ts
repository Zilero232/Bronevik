'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useReadInboxItem } from '@/entities/notification/inbox';
import { daysBetween, useClientNow } from '@/shared/lib';

import type { InboxDay } from '../../../lib/group-by-day';

export const useInboxFeedDay = ({ date, items, unread }: InboxDay) => {
  const t = useTranslations('notifications.feed');
  const format = useFormatter();
  const now = useClientNow();
  const onSelect = useReadInboxItem();

  return {
    label: match(now && daysBetween({ from: date, to: now }))
      .with(0, () => t('today'))
      .with(1, () => t('yesterday'))
      .otherwise(() => format.dateTime(date, { weekday: 'short', day: 'numeric', month: 'long' })),
    count: unread > 0 ? t('dayUnread', { count: unread, total: items.length }) : t('dayTotal', { total: items.length }),
    onSelect
  };
};
