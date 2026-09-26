'use client';

import { useFormatter, useTranslations } from 'next-intl';

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
    <ol className={s.root}>
      {entries.map(({ kind, value, from, to }) => (
        <li key={`${kind}-${value}-${from}`} className={s.entry} data-current={to === null}>
          <span className={s.value}>{value}</span>
          <span className={s.range}>
            {from ? format.dateTime(new Date(from), HISTORY.date) : t('unknown')}
            {' — '}
            {to ? format.dateTime(new Date(to), HISTORY.date) : t('now')}
          </span>
        </li>
      ))}
    </ol>
  );
};
