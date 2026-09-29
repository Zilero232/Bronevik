'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import type { BestBattleMetric, BestBattlePeriod } from '@/entities/battle/best-battle';
import type { ActiveFilter, SegmentedOption, SelectItem } from '@/ui-kit';

import { BEST_BATTLE_METRICS, BEST_BATTLE_PERIODS, getBestBattleFacets } from '@/entities/battle/best-battle';
import { mapQueries } from '@/entities/map/map';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';

import { BEST_BATTLES_VIEW } from '../../../config';
import { hasBattleFilters, pickMedal } from '../../../lib';
import { useBestBattlesState } from '../use-best-battles-state';

export const useBestBattlesFilters = () => {
  const t = useTranslations('bestBattles');
  const tFilters = useTranslations('common.filters');
  const locale = useLocale();
  const [state, setState] = useBestBattlesState();
  const catalog = useVehicleCatalog();
  const maps = useQuery(mapQueries.localizedList(locale));
  const facets = useQuery({
    queryKey: QUERY_KEYS.bestBattles.facets(state.period),
    queryFn: ({ signal }) => getBestBattleFacets({ period: state.period, signal }),
    staleTime: BEST_BATTLES_VIEW.staleMs
  });

  const any = { value: BEST_BATTLES_VIEW.anyValue, label: t('filters.anyMap') };
  const periodOptions: SegmentedOption<BestBattlePeriod>[] = BEST_BATTLE_PERIODS.map((value) => ({ value, label: t(`periods.${value}`) }));
  const metricItems: SelectItem<BestBattleMetric>[] = BEST_BATTLE_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }));
  const mapItems: SelectItem[] = [any, ...sortBy(maps.data ?? [], (map) => map.name).map((map) => ({ value: map.arenaId, label: map.name }))];

  const vehicle = state.tank === null ? null : (catalog.data?.find(({ tankId }) => tankId === state.tank) ?? null);
  const medals = facets.data?.medals ?? [];
  const mapName = (maps.data ?? []).find((map) => map.arenaId === state.map)?.name ?? state.map;
  const medalTitle = medals.find((medal) => medal.name === state.medal)?.title ?? state.medal;

  const active: ActiveFilter[] = [
    ...(state.tank === null
      ? []
      : [
          {
            id: 'tank',
            label: tFilters('span', { label: t('filters.tank'), value: vehicle?.shortName ?? String(state.tank) }),
            onRemove: () => void setState({ tank: null })
          }
        ]),
    ...(mapName
      ? [{ id: 'map', label: tFilters('span', { label: t('filters.map'), value: mapName }), onRemove: () => void setState({ map: null }) }]
      : []),
    ...(medalTitle
      ? [{ id: 'medal', label: tFilters('span', { label: t('filters.medals'), value: medalTitle }), onRemove: () => void setState({ medal: null }) }]
      : [])
  ];

  return {
    period: state.period,
    metric: state.metric,
    vehicle,
    mapValue: state.map ?? BEST_BATTLES_VIEW.anyValue,
    medals,
    active,
    medalValue: state.medal === null ? [] : [state.medal],
    periodOptions,
    metricItems,
    mapItems,
    isFiltered: hasBattleFilters(state),
    onPeriodChange: (period: BestBattlePeriod) => void setState({ period }),
    onMetricChange: (metric: BestBattleMetric) => void setState({ metric }),
    onVehicleChange: (vehicle: VehicleSummary | null) => void setState({ tank: vehicle?.tankId ?? null }),
    onMapChange: (value: string) => void setState({ map: value === BEST_BATTLES_VIEW.anyValue ? null : value }),
    onMedalsChange: (next: string[]) => void setState({ medal: pickMedal({ current: state.medal, next }) }),
    onReset: () => void setState({ tank: null, map: null, medal: null })
  };
};
