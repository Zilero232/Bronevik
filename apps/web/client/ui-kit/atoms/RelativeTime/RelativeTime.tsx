'use client';

import { useRelativeTime } from '@/shared/lib';

import type { RelativeTimeProps } from './RelativeTime.types';

export const RelativeTime = ({ value, fallback = '—', className }: RelativeTimeProps) => {
  const view = useRelativeTime(value);

  if (!view) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <time className={className} dateTime={view.iso} title={view.title}>
      {view.text}
    </time>
  );
};
