'use client';

import { useQuery } from '@tanstack/react-query';

import type { ShowcaseSource } from '../use-showcase-source';

import { buildQueries } from '../../../api';
import { SHOWCASE } from '../../../config';
import { useBuildContext } from '../../context';

export const useRecommendedBuild = (cohort: ShowcaseSource) => {
  const { vehicle } = useBuildContext();

  return useQuery(buildQueries.recommended({ tankId: vehicle.tankId, mode: SHOWCASE.mode, cohort }));
};
