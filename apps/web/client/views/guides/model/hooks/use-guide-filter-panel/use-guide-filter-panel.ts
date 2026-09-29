'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import { mapQueries, useMapLabels } from '@/entities/map/map';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { GuideKindFilter } from '../use-guide-filters';

import { GUIDE_KIND_FILTERS, GUIDE_LIST, GUIDE_SORTS } from '../../../config';
import { hasActiveFilters } from '../../../lib/guide-filters';
import { useGuideFilters } from '../use-guide-filters';

export const useGuideFilterPanel = () => {
  const t = useTranslations('guides');
  const locale = useLocale();
  const labels = useMapLabels();
  const { filters, setKind, setTank, setMap, setSort, reset } = useGuideFilters();
  const { data: catalog } = useVehicleCatalog();
  const { data: maps } = useQuery({
    ...mapQueries.localizedList(locale),
    enabled: filters.kind === 'map' || filters.map !== null
  });

  const kind: GuideKindFilter = filters.kind ?? 'all';
  const mapItems = sortBy(maps ?? [], (map) => map.name).map((map) => ({
    value: map.arenaId,
    label: map.camouflage ? `${map.name} · ${labels.camouflage(map.camouflage)}` : map.name
  }));

  return {
    kind,
    kindOptions: GUIDE_KIND_FILTERS.map((value) => ({ value, label: t(`kinds.${value}`) })),
    sort: filters.sort,
    sortItems: GUIDE_SORTS.map((value) => ({ value, label: t(`list.sorts.${value}`) })),
    tank: filters.tank === null ? null : (vehicleIndex(catalog)[filters.tank] ?? null),
    map: filters.map ?? GUIDE_LIST.anyMap,
    mapItems: [{ value: GUIDE_LIST.anyMap, label: t('list.filters.anyMap') }, ...mapItems],
    isTankShown: filters.kind === 'tank' || filters.tank !== null,
    isMapShown: filters.kind === 'map' || filters.map !== null,
    hasFilters: hasActiveFilters(filters),
    setKind,
    setSort,
    onTankChange: (vehicle: VehicleSummary | null) => setTank(vehicle?.tankId ?? null),
    onMapChange: (value: string) => setMap(value === GUIDE_LIST.anyMap ? null : value),
    reset
  };
};
