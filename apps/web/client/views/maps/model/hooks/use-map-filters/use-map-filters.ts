'use client';

import { useQueryStates } from 'nuqs';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';

import { MAP_FILTER_PARSERS } from '../../../config';

export const useMapFilters = () => {
  const [filters, setFilters] = useQueryStates(MAP_FILTER_PARSERS, { history: 'replace' });
  const { q, modes, camo, size, pinned } = filters;

  return {
    filters,
    isFiltered: q.length > 0 || modes.length > 0 || camo.length > 0 || size.length > 0 || pinned,
    onQueryChange: (next: string) => void setFilters({ q: next }),
    onModesChange: (next: MapModeKind[]) => void setFilters({ modes: next }),
    onCamoChange: (next: MapCamouflage[]) => void setFilters({ camo: next }),
    onReset: () => void setFilters(null)
  };
};
