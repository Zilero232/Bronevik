'use client';

import type { ModeTank, PlayMode } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { groupByRank } from '../../../lib/rank-groups';
import { useModeColumns } from '../use-mode-columns';
import { useModeMeta } from '../use-mode-meta';
import { useModeView } from '../use-mode-view';

export const useModeTanks = (mode: PlayMode) => {
  const router = useRouter();
  const { data, isLoading, isError, isRetrying, onRetry } = useModeMeta(mode);
  const { isActive, reset } = useVehicleFilters();
  const [view, setView] = useModeView();
  const columns = useModeColumns();

  const rows = data?.tanks ?? [];

  const onRowClick = (row: ModeTank) => {
    router.push(ROUTES.tanks.detail(row.vehicle.slug));
  };

  return {
    view,
    onViewChange: (next: typeof view) => void setView(next),
    columns,
    rows,
    groups: view === 'ranks' ? groupByRank(rows) : [],
    minBattles: data?.minBattles ?? null,
    isLoading,
    isError,
    isRetrying,
    isFiltered: isActive,
    onReset: () => void reset(),
    onRetry,
    onRowClick
  };
};
