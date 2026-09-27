'use client';

import { useQuery } from '@tanstack/react-query';

import { getBuildHistory } from '@/entities/tank/build';
import { usePlus } from '@/features/plus/plus-gate';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseBuildHistoryInput } from './use-build-history.types';

import { HOW_TO_BUILD } from '../../../config';
import { useTank } from '../../context';

export const useBuildHistory = ({ mode, cohort }: UseBuildHistoryInput) => {
  const { tankId } = useTank();
  const { isPlus } = usePlus();

  const params = { tankId, mode, cohort };

  return useQuery({
    queryKey: QUERY_KEYS.builds.history(params),
    queryFn: ({ signal }) => getBuildHistory({ ...params, signal }),
    enabled: isPlus,
    select: ({ entries }) => entries.slice(0, HOW_TO_BUILD.historyRows)
  });
};
