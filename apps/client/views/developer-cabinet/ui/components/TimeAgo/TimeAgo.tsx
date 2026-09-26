'use client';

import { useFormatter, useNow } from 'next-intl';

import type { TimeAgoProps } from './TimeAgo.types';

import { TIME_AGO } from '../../../config';

export const TimeAgo = ({ value, fallback = '—', className }: TimeAgoProps) => {
  const format = useFormatter();
  const now = useNow({ updateInterval: TIME_AGO.updateIntervalMs });

  if (value === null) {
    return <span className={className}>{fallback}</span>;
  }

  const date = new Date(value);

  return (
    <time className={className} dateTime={value} title={format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' })}>
      {format.relativeTime(date, now)}
    </time>
  );
};
