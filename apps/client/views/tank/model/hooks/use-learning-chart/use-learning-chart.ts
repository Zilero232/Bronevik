'use client';

import { useTranslations } from 'next-intl';

import { bucketLabel } from '../../../lib';
import { useTank } from '../../context';

export const useLearningChart = () => {
  const t = useTranslations('tank.learning');
  const { detail } = useTank();

  const { learning } = detail;
  const hasData = learning.buckets.some((bucket) => bucket.winRate !== null);

  return {
    hasData,
    difficulty: learning.difficulty,
    gain: learning.gain,
    windowDays: learning.windowDays,
    labels: learning.buckets.map(bucketLabel),
    series: [{ id: 'winRate', label: t('winRate'), values: learning.buckets.map((bucket) => bucket.winRate ?? 0), tone: 'accent' as const }],
    battles: learning.buckets.reduce((total, bucket) => total + bucket.battles, 0)
  };
};
