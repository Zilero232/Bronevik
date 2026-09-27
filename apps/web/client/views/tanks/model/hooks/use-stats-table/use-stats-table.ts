'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

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
  const [{ statuses, roles, difficulties }, setState] = useTanksState();
  const { reset, isActive } = useVehicleFilters();
  const isHydrated = useHydrated();
  const { value: stored, set: setHidden } = useLocalStorage<readonly string[]>(STORAGE_KEYS.tanksColumns, TANKS_TABLE.hiddenByDefault);
  const hidden = (isHydrated ? stored : undefined) ?? TANKS_TABLE.hiddenByDefault;
  const columns = useTankColumns({ hidden });

  const onReset = () => {
    void reset();
    void setState({ statuses: null, roles: null, difficulties: null });
  };

  return {
    columns,
    query,
    visibleColumns: TANKS_TABLE.optionalColumns.filter((id) => !hidden.includes(id)),
    isFiltered: isActive || statuses.length > 0 || roles.length > 0 || difficulties.length > 0,
    onReset,
    onColumnsChange: (visible: OptionalTankColumn[]) => setHidden(TANKS_TABLE.optionalColumns.filter((id) => !visible.includes(id))),
    onExport: () => downloadFile({ name: TANKS_TABLE.csvName, content: toCsv(tanksCsvRows(query.data?.items ?? [])), type: DATA_FILE.csvType })
  };
};
