'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { range, times } from 'remeda';

import { getHeatmap } from '@/entities/replay/replay';
import { useReplayMapName } from '@/features/community/replay-meta';
import { QUERY_KEYS } from '@/shared/constants';

import type { HeatmapModeChoice, HeatmapScope } from './use-replay-heatmap.types';

import { HEATMAP_VIEW } from '../../../config';
import { heatCells } from '../../../lib/heatmap-scale';
import { useReplay } from '../../context';

export const useReplayHeatmap = () => {
  const replay = useReplay();
  const mapNameOf = useReplayMapName();
  const [modeChoice, setModeChoice] = useState<HeatmapModeChoice>('replay');
  const [scope, setScope] = useState<HeatmapScope>(HEATMAP_VIEW.allScope);

  const mode = modeChoice === 'replay' && replay.battleType ? replay.battleType : HEATMAP_VIEW.allMode;
  const params = { arenaId: replay.arenaId ?? '', mode, scope };

  const query = useQuery({
    queryKey: QUERY_KEYS.replays.heatmap(params),
    queryFn: ({ signal }) => getHeatmap({ ...params, signal }),
    enabled: replay.arenaId !== null,
    staleTime: HEATMAP_VIEW.staleMs,
    placeholderData: keepPreviousData,
    select: ({ gridSize, samples, cells }) => ({
      gridSize,
      samples,
      cells: heatCells({ cells, gridSize, levels: HEATMAP_VIEW.levels }),
      gridLines: times(HEATMAP_VIEW.gridDivisions - 1, (index) => ((index + 1) * gridSize) / HEATMAP_VIEW.gridDivisions)
    })
  });

  return {
    mapName: mapNameOf(replay),
    hasArena: replay.arenaId !== null,
    hasReplayMode: replay.battleType !== null,
    modeChoice,
    scope,
    levels: range(1, HEATMAP_VIEW.levels + 1),
    query,
    setModeChoice,
    setScope
  };
};
