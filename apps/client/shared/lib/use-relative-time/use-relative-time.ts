'use client';

import { formatISO, isValid, toDate } from 'date-fns';
import { useFormatter, useNow } from 'next-intl';

import type { RelativeTimeValue, RelativeTimeView } from './use-relative-time.types';

import { RELATIVE_TIME } from './use-relative-time.constants';

export const useRelativeTime = (value: RelativeTimeValue | null | undefined): RelativeTimeView | null => {
  const format = useFormatter();
  const now = useNow({ updateInterval: RELATIVE_TIME.tickMs });

  if (value === null || value === undefined) {
    return null;
  }

  const date = toDate(value);

  if (!isValid(date)) {
    return null;
  }

  return {
    text: format.relativeTime(date, now),
    iso: formatISO(date),
    title: format.dateTime(date, 'dateTime')
  };
};
