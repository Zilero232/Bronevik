'use client';

import { useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';

import { FIGURE_FORMAT, OVERVIEW } from '../../../config';
import { recentSeries } from '../../../lib/recent-series';
import { useProfileContext } from '../../context';
import { usePlayerHistory } from '../use-profile-queries';

export const useHighlightStats = () => {
  const t = useTranslations('profile.overview.highlights');
  const { profile } = useProfileContext();
  const granularity = OVERVIEW.highlightGranularity;
  const wn8 = usePlayerHistory({ metric: 'wn8', granularity });
  const winRate = usePlayerHistory({ metric: 'winRate', granularity });
  const avgDamage = usePlayerHistory({ metric: 'avgDamage', granularity });
  const battles = usePlayerHistory({ metric: 'battles', granularity });

  const stats = profile.recent.find(({ period }) => period === OVERVIEW.highlightPeriod)?.stats ?? null;
  const trend = (series: typeof wn8) => recentSeries({ series: series.data, count: OVERVIEW.highlightDays });

  return {
    hasStats: stats !== null,
    items: [
      {
        key: 'wn8',
        label: t('wn8'),
        value: stats?.wn8.value ?? null,
        tone: stats ? ratingValueTone(stats.wn8) : undefined,
        format: FIGURE_FORMAT.integer,
        suffix: undefined,
        trend: trend(wn8)
      },
      {
        key: 'winRate',
        label: t('winRate'),
        value: stats?.winRate ?? null,
        tone: stats ? winRateTone(stats.winRate) : undefined,
        format: FIGURE_FORMAT.percent,
        suffix: '%',
        trend: trend(winRate)
      },
      {
        key: 'avgDamage',
        label: t('avgDamage'),
        value: stats?.avgDamage ?? null,
        tone: undefined,
        format: FIGURE_FORMAT.integer,
        suffix: undefined,
        trend: trend(avgDamage)
      },
      {
        key: 'battlesPerDay',
        label: t('battlesPerDay'),
        value: stats ? stats.battles / OVERVIEW.highlightDays : null,
        tone: undefined,
        format: FIGURE_FORMAT.decimal,
        suffix: undefined,
        trend: trend(battles)
      }
    ] as const
  };
};
