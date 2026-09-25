'use client';

import type { RatingValue } from '@bronevik/schemas';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { percentText } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { RosterRow } from '../../../lib/roster';

import s from './use-roster-columns.module.scss';

const DASH = '—';

export const ActivityCell = ({ inactiveDays, status }: Pick<RosterRow, 'inactiveDays' | 'status'>) => {
  const t = useTranslations('clans.roster');

  return (
    <span className={s.activity}>
      <span aria-hidden className={s.dot} data-status={status} />
      {inactiveDays === null ? t('unknown') : t('daysAgo', { days: inactiveDays })}
      <span className={s.srOnly}>{t(`status.${status}`)}</span>
    </span>
  );
};

export const WinRateCell = ({ winRate }: Pick<RosterRow, 'winRate'>) => {
  const format = useFormatter();

  if (winRate === null) {
    return <span className={s.dim}>{DASH}</span>;
  }

  return <RatingBadge size='sm' tone={winRateTone(winRate)} value={percentText({ format, value: winRate })} withPips={false} />;
};

export const RatingCell = ({ value, tier }: RatingValue) => {
  const format = useFormatter();

  if (value === null) {
    return <span className={s.dim}>{DASH}</span>;
  }

  return <RatingBadge size='sm' tone={ratingValueTone({ value, tier })} value={format.number(value)} withPips={false} />;
};
