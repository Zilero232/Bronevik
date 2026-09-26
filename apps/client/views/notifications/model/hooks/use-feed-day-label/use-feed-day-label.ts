'use client';

import { differenceInCalendarDays } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useClientNow } from '@/shared/lib';

export const useFeedDayLabel = (date: Date) => {
  const t = useTranslations('notifications.feed');
  const format = useFormatter();
  const now = useClientNow();

  return match(now && differenceInCalendarDays(now, date))
    .with(0, () => t('today'))
    .with(1, () => t('yesterday'))
    .otherwise(() => format.dateTime(date, { weekday: 'short', day: 'numeric', month: 'long' }));
};
