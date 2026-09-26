'use client';

import { useFormatter } from 'next-intl';

import { WinRateCell } from '@/entities/tank/tank';

import type { RecentCellProps } from './RecentCell.types';

import s from './RecentCell.module.scss';

export const RecentCell = ({ recent }: RecentCellProps) => {
  const format = useFormatter();

  const stats = recent?.stats;

  if (!stats) {
    return <span className={s.dim}>—</span>;
  }

  return (
    <span className={s.root}>
      {format.number(stats.battles)}
      <WinRateCell className={s.rate} digits={1} value={stats.winRate} />
    </span>
  );
};
