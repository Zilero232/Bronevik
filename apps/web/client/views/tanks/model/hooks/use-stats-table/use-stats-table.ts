'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { usePinnedRows } from '@/features/app/pin-rows';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { STORAGE_KEYS } from '@/shared/constants';
import { DATA_FILE, downloadFile, toCsv, useHydrated } from '@/shared/lib';

import type { OptionalTankColumn } from '../use-tank-columns';

import { TANKS_TABLE } from '../../../config';
import { tanksCsvRows } from '../../../lib/tanks-csv';
import { useTankColumns } from '../use-tank-columns';
import { useTankStats } from '../use-tank-stats';
import { useTanksState } from '../use-tanks-state';

export const useStatsTable = () => {
  const query = useTankStats();
  const [{ difficulties, top, pinned }, setState] = useTanksState();
  const { reset, isActive } = useVehicleFilters();
  const { pinnedIds } = usePinnedRows('tanks');
  const isHydrated = useHydrated();
  const { value: stored, set: setHidden } = useLocalStorage<readonly string[]>(STORAGE_KEYS.tanksColumns, TANKS_TABLE.hiddenByDefault);
  const hidden = (isHydrated ? stored : undefined) ?? TANKS_TABLE.hiddenByDefault;
  const columns = useTankColumns({ hidden });

  const items = query.data?.items ?? [];
  const rows = pinned ? items.filter(({ vehicle }) => pinnedIds.includes(String(vehicle.tankId))) : items;

  const onReset = () => {
    void reset();
    void setState({ difficulties: null, top: null, pinned: null });
  };

  return {
    columns,
    query,
    rows,
    pinnedIds,
    visibleColumns: TANKS_TABLE.optionalColumns.filter((id) => !hidden.includes(id)),
    isFiltered: isActive || difficulties.length > 0 || top || pinned,
    onReset,
    onColumnsChange: (visible: OptionalTankColumn[]) => setHidden(TANKS_TABLE.optionalColumns.filter((id) => !visible.includes(id))),
    onExport: () => downloadFile({ name: TANKS_TABLE.csvName, content: toCsv(tanksCsvRows(rows)), type: DATA_FILE.csvType })
  };
};
