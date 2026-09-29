'use client';

import { useFormatter } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { CommunityPlayerStats } from '../../../lib/stats-tones';

import { statsTones, winRatePercent } from '../../../lib/stats-tones';

export const usePlayerStatsLine = (stats: CommunityPlayerStats | null) => {
  const format = useFormatter();

  if (!stats) {
    return null;
  }

  const tones = statsTones(stats);

  return [
    { key: 'battles', value: format.number(stats.battles), tone: undefined },
    { key: 'wn8', value: stats.wn8 === null ? '—' : format.number(Math.round(stats.wn8)), tone: tones.wn8 ?? undefined },
    { key: 'winRate', value: percentText({ format, value: winRatePercent(stats.winRate) }), tone: tones.winRate ?? undefined }
  ] as const;
};
