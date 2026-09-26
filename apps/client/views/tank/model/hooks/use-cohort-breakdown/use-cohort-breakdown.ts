'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingTone } from '@/shared/lib';

import type { CohortLine } from './use-cohort-breakdown.types';

import { cohortBreakdown } from '../../../lib';
import { useTank } from '../../context';

export const useCohortBreakdown = () => {
  const t = useTranslations('tank.stats');
  const format = useFormatter();
  const { detail } = useTank();

  const lines: CohortLine[] = cohortBreakdown(detail.serverStats).map(({ cohort, winRate, avgDamage, battles, damageShare }) => ({
    cohort,
    label: t(`cohorts.${cohort}`),
    winRate: `${format.number(winRate, { maximumFractionDigits: 2 })}\u00A0%`,
    tone: ratingTone({ scale: 'winRate', value: winRate }),
    avgDamage: format.number(avgDamage, { maximumFractionDigits: 0 }),
    battles: format.number(battles, { notation: 'compact', maximumFractionDigits: 1 }),
    damageShare
  }));

  return { lines };
};
