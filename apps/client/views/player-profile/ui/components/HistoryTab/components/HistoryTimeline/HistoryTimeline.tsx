'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROW_ITEM } from '@/shared/lib';

import type { HistoryTimelineProps } from './HistoryTimeline.types';

import s from './HistoryTimeline.module.scss';

const MONTH_YEAR = { month: 'long', year: 'numeric' } as const;

export const HistoryTimeline = ({ entries, icon }: HistoryTimelineProps) => {
  const t = useTranslations('profile.history');
  const format = useFormatter();

  if (entries.length === 0) {
    return <p className={s.empty}>{t('empty')}</p>;
  }

  return (
    <ol className={s.root}>
      {entries.map(({ kind, value, from, to }, index) => (
        <motion.li
          key={`${kind}-${value}-${from}`}
          animate='visible'
          className={s.entry}
          custom={index}
          data-current={to === null}
          initial='hidden'
          variants={ROW_ITEM}
        >
          <span aria-hidden className={s.dot}>
            {icon}
          </span>
          <span className={s.value}>{value}</span>
          <span className={s.range}>
            {from ? format.dateTime(new Date(from), MONTH_YEAR) : t('unknown')}
            {' — '}
            {to ? format.dateTime(new Date(to), MONTH_YEAR) : t('now')}
          </span>
        </motion.li>
      ))}
    </ol>
  );
};
