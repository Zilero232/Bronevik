'use client';

import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

import { calculateLoadout, serializeLoadout } from '@/entities/tank/build';
import { specsOfStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseBuildStatsInput } from './use-build-stats.types';

import { loadoutRequest } from '../../../lib/loadout-edit';

export const useBuildStats = ({ tankId, loadout, modules, still }: UseBuildStatsInput) =>
  useQuery({
    queryKey: QUERY_KEYS.builds.stats({ tankId, code: loadout ? serializeLoadout(loadout) : null, still }),
    queryFn: loadout ? ({ signal }) => calculateLoadout({ tankId, request: loadoutRequest({ loadout, modules, still }), signal }) : skipToken,
    select: ({ stats }) => specsOfStats(stats),
    placeholderData: keepPreviousData
  });
