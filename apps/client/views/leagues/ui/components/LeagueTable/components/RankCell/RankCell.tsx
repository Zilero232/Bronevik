'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { RankCellProps } from './RankCell.types';

import s from './RankCell.module.scss';

export const RankCell = ({ row }: RankCellProps) => {
  const t = useTranslations('social.leagues.legend');

  return (
    <span className={s.root} data-ranked={row.value !== null} data-zone={row.zone ?? 'stay'}>
      <span className={s.rank}>{row.value === null ? '—' : row.rank}</span>
      {row.zone === 'promotion' && <ArrowUp aria-label={t('promotion')} className={s.icon} size={14} />}
      {row.zone === 'relegation' && <ArrowDown aria-label={t('relegation')} className={s.icon} size={14} />}
    </span>
  );
};
