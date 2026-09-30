'use client';

import { useRecommendedBuild } from '../use-recommended-build';
import { useShowcaseSource } from '../use-showcase-source';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useSourceToggle = () => {
  const { source, isPlus, onSourceChange } = useShowcaseSource();
  const usage = useShowcaseUsage();
  const { isPending } = useRecommendedBuild(source);

  return { source, isPlus, usage, isUsagePending: isPending, hasSample: (usage?.battles ?? 0) > 0, onSourceChange };
};
