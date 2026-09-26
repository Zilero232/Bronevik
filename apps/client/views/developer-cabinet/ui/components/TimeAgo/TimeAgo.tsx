'use client';

import { useFormatter } from 'next-intl';

import { useClientNow } from '@/shared/lib';

import type { TimeAgoProps } from './TimeAgo.types';

import { TIME_AGO } from '../../../config';

export const TimeAgo = ({ value, fallback = '—', className }: TimeAgoProps) => {
  const format = useFormatter();
  const now = useClientNow({ updateInterval: TIME_AGO.updateIntervalMs });

  if (value === null) {
    return <span className={className}>{fallback}</span>;
  }

  const date = new Date(value);
  const title = format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <time className={className} dateTime={value} title={title}>
      {now ? format.relativeTime(date, now) : title}
    </time>
  );
};
