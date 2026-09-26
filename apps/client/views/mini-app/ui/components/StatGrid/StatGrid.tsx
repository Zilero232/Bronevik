'use client';

import { useTranslations } from 'next-intl';
import { range } from 'remeda';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { Skeleton, StatTile } from '@/ui-kit';

import type { StatGridProps } from './StatGrid.types';

import { STAT_GRID } from '../../../config';

import s from './StatGrid.module.scss';

export const StatGrid = ({ stats }: StatGridProps) => {
  const t = useTranslations('tg.stats');

  if (!stats) {
    return (
      <div aria-busy className={s.root}>
        {range(0, STAT_GRID.skeletonTiles).map((index) => (
          <Skeleton key={index} height={72} shape='block' />
        ))}
      </div>
    );
  }

  return (
    <div className={s.root}>
      <StatTile label='WN8' tone={ratingValueTone(stats.wn8)} value={Math.round(stats.wn8.value ?? 0)} />
      <StatTile format={STAT_GRID.winRateFormat} label={t('winRate')} suffix='%' tone={winRateTone(stats.winRate)} value={stats.winRate ?? 0} />
      <StatTile label={t('avgDamage')} value={Math.round(stats.avgDamage ?? 0)} />
      <StatTile label={t('battles')} value={stats.battles} />
    </div>
  );
};
