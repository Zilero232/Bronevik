'use client';

import { deltaVerdict } from '@/shared/lib';

import { useRecommendedBuild } from '../use-recommended-build';
import { useShowcaseSource } from '../use-showcase-source';

export const useShowcaseComparison = () => {
  const { source, other } = useShowcaseSource();
  const { data, isPending, isError } = useRecommendedBuild(source);
  const usage = data?.usage ?? null;
  const otherUsage = useRecommendedBuild(other).data?.usage ?? null;

  const items = [
    { id: 'winRate' as const, value: usage?.winRate ?? null, other: otherUsage?.winRate ?? null, isPercent: true },
    { id: 'avgDamage' as const, value: usage?.avgDamage ?? null, other: otherUsage?.avgDamage ?? null, isPercent: false }
  ].map((item) => {
    const delta = item.value !== null && item.other !== null ? item.value - item.other : null;

    return { ...item, delta, verdict: delta === null ? null : deltaVerdict({ value: delta }) };
  });

  return {
    items,
    other,
    isPending,
    isShown: isPending || isError || (usage !== null && usage.battles > 0 && items.some(({ value }) => value !== null))
  };
};
