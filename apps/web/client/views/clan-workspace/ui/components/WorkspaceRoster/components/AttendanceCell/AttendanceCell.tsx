'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { AttendanceCellProps } from './AttendanceCell.types';

import { attendanceTone } from '../../../../../lib/attendance';

import s from './AttendanceCell.module.scss';

export const AttendanceCell = ({ row: { attended, total, rate } }: AttendanceCellProps) => {
  const t = useTranslations('clanWorkspace.roster');
  const format = useFormatter();

  if (rate === null) {
    return <span className={s.muted}>{t('noEvents')}</span>;
  }

  return (
    <span className={s.root} data-tone={attendanceTone(rate)} title={t('attendedOf', { attended, total })}>
      {format.number(rate, 'share')}
      <span className={s.detail}>{t('attendedShort', { attended, total })}</span>
    </span>
  );
};
