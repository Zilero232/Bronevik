'use client';

import { Flame, Gauge, Percent, Swords } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { Skeleton, StatTile } from '@/ui-kit';

import type { StatGridProps } from './StatGrid.types';

import s from './StatGrid.module.scss';

const DECIMALS_2 = { maximumFractionDigits: 2, minimumFractionDigits: 2 } as const;

export const StatGrid = ({ stats }: StatGridProps) => {
  const t = useTranslations('tg.stats');

  if (!stats) {
    return (
      <div aria-busy className={s.root}>
        <Skeleton height={88} shape='block' />
        <Skeleton height={88} shape='block' />
        <Skeleton height={88} shape='block' />
        <Skeleton height={88} shape='block' />
      </div>
    );
  }

  return (
    <div className={s.root}>
      <StatTile icon={<Gauge size={16} />} label='WN8' tone={ratingValueTone(stats.wn8)} value={Math.round(stats.wn8.value ?? 0)} />
      <StatTile
        format={DECIMALS_2}
        icon={<Percent size={16} />}
        label={t('winRate')}
        suffix='%'
        tone={winRateTone(stats.winRate)}
        value={stats.winRate ?? 0}
      />
      <StatTile icon={<Flame size={16} />} label={t('avgDamage')} value={Math.round(stats.avgDamage ?? 0)} />
      <StatTile icon={<Swords size={16} />} label={t('battles')} tone='steel' value={stats.battles} />
    </div>
  );
};
