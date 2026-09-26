'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { Replay } from '@/entities/replay/replay';

import { getHeatmap } from '@/entities/replay/replay';
import { QUERY_KEYS } from '@/shared/constants';

import type { HeatmapModeChoice, HeatmapScope } from './use-replay-heatmap.types';

import { HEATMAP_VIEW } from '../../../config';
import { heatCells } from '../../../lib/heatmap-scale';

export const useReplayHeatmap = (replay: Pick<Replay, 'arenaId' | 'battleType'>) => {
  const [modeChoice, setModeChoice] = useState<HeatmapModeChoice>('replay');
  const [scope, setScope] = useState<HeatmapScope>(HEATMAP_VIEW.allScope);

  const arenaId = replay.arenaId;
  const mode = modeChoice === 'replay' && replay.battleType ? replay.battleType : HEATMAP_VIEW.allMode;
  const params = { arenaId: arenaId ?? '', mode, scope };

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.replays.heatmap(params),
    queryFn: ({ signal }) => getHeatmap({ ...params, signal }),
    enabled: arenaId !== null,
    staleTime: HEATMAP_VIEW.staleMs,
    placeholderData: keepPreviousData
  });

  const gridSize = data?.gridSize ?? 0;

  return {
    hasArena: arenaId !== null,
    hasReplayMode: replay.battleType !== null,
    modeChoice,
    scope,
    gridSize,
    samples: data?.samples ?? 0,
    updatedAt: data?.updatedAt ?? null,
    cells: data ? heatCells({ cells: data.cells, gridSize, levels: HEATMAP_VIEW.levels }) : [],
    gridLines:
      gridSize > 0 ? Array.from({ length: HEATMAP_VIEW.gridDivisions - 1 }, (_, index) => ((index + 1) * gridSize) / HEATMAP_VIEW.gridDivisions) : [],
    levels: Array.from({ length: HEATMAP_VIEW.levels }, (_, index) => index + 1),
    isPending: arenaId !== null && isPending,
    isError,
    isFetching,
    setModeChoice,
    setScope,
    retry: () => void refetch()
  };
};
