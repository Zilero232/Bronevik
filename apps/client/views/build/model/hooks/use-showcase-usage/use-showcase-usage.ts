'use client';

import { useRecommendedBuild } from '../use-recommended-build';
import { useShowcaseSource } from '../use-showcase-source';

export const useShowcaseUsage = () => {
  const { source } = useShowcaseSource();
  const { data } = useRecommendedBuild(source);

  return data?.usage ?? null;
};
