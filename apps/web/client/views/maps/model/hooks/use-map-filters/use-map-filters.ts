'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import type { MapCamouflage, MapModeKind } from '@/entities/map/map';
import type { ActiveFilter } from '@/ui-kit';

import { shortList } from '@/shared/lib';

import { MAP_FILTER_PARSERS, MAPS_VIEW } from '../../../config';

export const useMapFilters = () => {
  const t = useTranslations('maps');
  const tFilters = useTranslations('common.filters');
  const [filters, setFilters] = useQueryStates(MAP_FILTER_PARSERS, { history: 'replace' });
  const { q, modes, camo, size, pinned } = filters;

  const active: ActiveFilter[] = [
    ...(q.length > 0
      ? [{ id: 'q', label: tFilters('span', { label: t('filters.search'), value: q }), onRemove: () => void setFilters({ q: null }) }]
      : []),
    ...(modes.length > 0
      ? [
          {
            id: 'modes',
            label: tFilters('span', {
              label: t('filters.modes'),
              value: shortList({ items: modes.map((mode) => t(`modes.${mode}`)), max: MAPS_VIEW.chipItems })
            }),
            onRemove: () => void setFilters({ modes: null })
          }
        ]
      : []),
    ...(camo.length > 0
      ? [
          {
            id: 'camo',
            label: tFilters('span', {
              label: t('filters.camouflage'),
              value: shortList({ items: camo.map((value) => t(`camouflage.${value}`)), max: MAPS_VIEW.chipItems })
            }),
            onRemove: () => void setFilters({ camo: null })
          }
        ]
      : [])
  ];

  return {
    filters,
    active,
    activeCount: active.length + Number(size.length > 0) + Number(pinned),
    isFiltered: q.length > 0 || modes.length > 0 || camo.length > 0 || size.length > 0 || pinned,
    onQueryChange: (next: string) => void setFilters({ q: next }),
    onModesChange: (next: MapModeKind[]) => void setFilters({ modes: next }),
    onCamoChange: (next: MapCamouflage[]) => void setFilters({ camo: next }),
    onReset: () => void setFilters(null)
  };
};
