'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import type { SelectItem } from '@/ui-kit';

import { mapQueries } from '@/entities/map/map';
import { useReplayModeLabel } from '@/features/community/replay-meta';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { ReplayResult, ReplaySort } from '../../../lib/replay-query';

import { REPLAY_LIST, REPLAY_RESULTS, REPLAY_SORTS } from '../../../config';
import { replayModeOptions } from '../../../lib/replay-modes';
import { fromSelectValue, hasActiveFilters, toSelectValue } from '../../../lib/replay-query';
import { useReplayFilters } from '../use-replay-filters';

export const useReplayFilterPanel = () => {
  const t = useTranslations('replays.filters');
  const modeLabel = useReplayModeLabel();
  const { filters, playerDraft, update, reset } = useReplayFilters();
  const catalog = useVehicleCatalog();
  const maps = useQuery(mapQueries.list());

  const mapList = maps.data ?? [];
  const any = { value: REPLAY_LIST.anyValue, label: t('any') };
  const vehicle = filters.tank === null ? null : (catalog.data?.find(({ tankId }) => tankId === filters.tank) ?? null);
  const modes = replayModeOptions({ maps: mapList, arenaId: filters.map, hidden: REPLAY_LIST.hiddenModes });

  const mapItems: SelectItem[] = [any, ...sortBy(mapList, (map) => map.name).map((map) => ({ value: map.arenaId, label: map.name }))];
  const modeItems: SelectItem[] = [any, ...modes.map((mode) => ({ value: mode, label: modeLabel(mode) }))];
  const resultItems: SelectItem[] = [any, ...REPLAY_RESULTS.map((result) => ({ value: result, label: t(`results.${result}`) }))];
  const sortItems: SelectItem<ReplaySort>[] = REPLAY_SORTS.map((sort) => ({ value: sort, label: t(`sorts.${sort}`) }));

  return {
    vehicle,
    playerDraft,
    mapValue: toSelectValue(filters.map),
    modeValue: toSelectValue(filters.mode),
    resultValue: toSelectValue(filters.result),
    sort: filters.sort,
    mapItems,
    modeItems,
    resultItems,
    sortItems,
    isFiltered: hasActiveFilters({ ...filters, player: playerDraft }),
    onVehicleChange: (next: VehicleSummary | null) => update({ tank: next?.tankId ?? null }),
    onMapChange: (value: string) => update({ map: fromSelectValue(value) }),
    onModeChange: (value: string) => update({ mode: fromSelectValue(value) }),
    onResultChange: (value: string) => update({ result: REPLAY_RESULTS.find((result): result is ReplayResult => result === value) ?? null }),
    onSortChange: (sort: ReplaySort) => update({ sort }),
    onPlayerChange: (player: string) => update({ player }),
    onReset: reset
  };
};
