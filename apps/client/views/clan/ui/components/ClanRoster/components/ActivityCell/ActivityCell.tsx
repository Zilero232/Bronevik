'use client';

import { useTranslations } from 'next-intl';

import type { ActivityCellProps } from './ActivityCell.types';

import s from './ActivityCell.module.scss';

export const ActivityCell = ({ inactiveDays, status }: ActivityCellProps) => {
  const t = useTranslations('clans.roster');

  return (
    <span className={s.root}>
      <span aria-hidden className={s.dot} data-status={status} />
      {inactiveDays === null ? t('unknown') : t('daysAgo', { days: inactiveDays })}
      <span className={s.srOnly}>{t(`status.${status}`)}</span>
    </span>
  );
};
