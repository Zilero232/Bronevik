'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Timeline } from '@/ui-kit';

import type { HistoryTimelineProps } from './HistoryTimeline.types';

import { HISTORY } from '../../../../../config';

import s from './HistoryTimeline.module.scss';

export const HistoryTimeline = ({ entries }: HistoryTimelineProps) => {
  const t = useTranslations('profile.history');
  const format = useFormatter();

  if (entries.length === 0) {
    return <p className={s.empty}>{t('noChanges')}</p>;
  }

  return (
    <Timeline
      items={entries.map(({ kind, value, from, to }) => ({
        id: `${kind}-${value}-${from}`,
        tone: to === null ? 'accent' : 'neutral',
        isCurrent: to === null,
        content: (
          <span className={s.entry}>
            <span className={s.value}>{value}</span>
            <span className={s.range}>
              {from ? format.dateTime(new Date(from), HISTORY.date) : t('unknown')}
              {' — '}
              {to ? format.dateTime(new Date(to), HISTORY.date) : t('now')}
            </span>
          </span>
        )
      }))}
    />
  );
};
