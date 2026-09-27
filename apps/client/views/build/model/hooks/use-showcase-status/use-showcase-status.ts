'use client';

import { useRecommendedBuild } from '../use-recommended-build';
import { useShowcaseSource } from '../use-showcase-source';

export const useShowcaseStatus = () => {
  const { source } = useShowcaseSource();

  return useRecommendedBuild(source);
};
