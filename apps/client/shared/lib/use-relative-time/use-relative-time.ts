'use client';

import { formatISO, isValid, toDate } from 'date-fns';
import { useFormatter } from 'next-intl';

import type { RelativeTimeValue, RelativeTimeView } from './use-relative-time.types';

import { useClientNow } from '../use-client-now';
import { RELATIVE_TIME } from './use-relative-time.constants';

export const useRelativeTime = (value: RelativeTimeValue | null | undefined): RelativeTimeView | null => {
  const format = useFormatter();
  const now = useClientNow({ updateInterval: RELATIVE_TIME.tickMs });

  if (value === null || value === undefined) {
    return null;
  }

  const date = toDate(value);

  if (!isValid(date)) {
    return null;
  }

  const title = format.dateTime(date, 'dateTime');

  return {
    text: now ? format.relativeTime(date, now) : title,
    iso: formatISO(date),
    title
  };
};
