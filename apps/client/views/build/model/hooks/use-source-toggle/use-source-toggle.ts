'use client';

import { useShowcaseSource } from '../use-showcase-source';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useSourceToggle = () => {
  const { source, isPlus, onSourceChange } = useShowcaseSource();
  const usage = useShowcaseUsage();

  return { source, isPlus, usage, onSourceChange };
};
