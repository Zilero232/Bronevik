'use client';

import type { PlayMode } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { groupByRank } from '../../../lib/rank-groups';
import { useModeColumns } from '../use-mode-columns';
import { useModeMeta } from '../use-mode-meta';
import { useModeView } from '../use-mode-view';

export const useModeTanks = (mode: PlayMode) => {
  const query = useModeMeta(mode);
  const { isActive, reset } = useVehicleFilters();
  const [view, setView] = useModeView();
  const columns = useModeColumns();

  const rows = query.data?.tanks ?? [];

  return {
    view,
    onViewChange: (next: typeof view) => void setView(next),
    columns,
    rows,
    groups: view === 'ranks' ? groupByRank(rows) : [],
    minBattles: query.data?.minBattles ?? null,
    query,
    isFiltered: isActive,
    onReset: () => void reset()
  };
};
