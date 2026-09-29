'use client';

import type { Nation, TankClass } from '@otmetki/icons';
import type { ReplayTag, VehicleSummary } from '@otmetki/schemas';

import { REPLAY_MASTERY_LEVELS, REPLAY_TAG_RULES, REPLAY_TAGS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import type { SelectItem } from '@/ui-kit';

import { mapQueries } from '@/entities/map/map';
import { useReplayModeLabel } from '@/features/community/replay-meta';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { ReplayResult, ReplaySort } from '../../../lib/replay-query';
import type { MinimumChange } from './use-replay-filter-panel.types';

import { replayVersionsQuery } from '../../../api';
import { REPLAY_LIST, REPLAY_MINIMUM_STEP, REPLAY_MINIMUMS, REPLAY_RESULTS, REPLAY_SORTS } from '../../../config';
import { replayModeOptions } from '../../../lib/replay-modes';
import { fromSelectValue, hasActiveFilters, toSelectValue } from '../../../lib/replay-query';
import { useReplayFilters } from '../use-replay-filters';

export const useReplayFilterPanel = () => {
  const t = useTranslations('replays.filters');
  const locale = useLocale();
  const tTags = useTranslations('replays.tags');
  const modeLabel = useReplayModeLabel();
  const { filters, playerDraft, clanDraft, update, reset } = useReplayFilters();
  const catalog = useVehicleCatalog();
  const maps = useQuery(mapQueries.localizedList(locale));
  const versions = useQuery(replayVersionsQuery());

  const mapList = maps.data ?? [];
  const any = { value: REPLAY_LIST.anyValue, label: t('any') };
  const vehicle = filters.tank === null ? null : (catalog.data?.find(({ tankId }) => tankId === filters.tank) ?? null);
  const modes = replayModeOptions({ maps: mapList, arenaId: filters.map, hidden: REPLAY_LIST.hiddenModes });

  const mapItems: SelectItem[] = [any, ...sortBy(mapList, (map) => map.name).map((map) => ({ value: map.arenaId, label: map.name }))];
  const modeItems: SelectItem[] = [any, ...modes.map((mode) => ({ value: mode, label: modeLabel(mode) }))];
  const resultItems: SelectItem[] = [any, ...REPLAY_RESULTS.map((result) => ({ value: result, label: t(`results.${result}`) }))];
  const sortItems: SelectItem<ReplaySort>[] = REPLAY_SORTS.map((sort) => ({ value: sort, label: t(`sorts.${sort}`) }));
  const masteryItems: SelectItem[] = [
    any,
    ...[...REPLAY_MASTERY_LEVELS].reverse().map((level) => ({ value: String(level), label: t(`mastery.${level}`) }))
  ];

  const versionItems: SelectItem[] = [any, ...(versions.data ?? []).map((version) => ({ value: version, label: version }))];
  const tagOptions = REPLAY_TAGS.map((tag) => ({ value: tag, label: tTags(`${tag}.label`), title: tTags(`${tag}.rule`, REPLAY_TAG_RULES[tag]) }));
  const minimums = REPLAY_MINIMUMS.map((key) => ({ key, value: filters[key], step: REPLAY_MINIMUM_STEP[key], label: t(`minimums.${key}`) }));

  return {
    vehicle,
    playerDraft,
    clanDraft,
    mapValue: toSelectValue(filters.map),
    modeValue: toSelectValue(filters.mode),
    resultValue: toSelectValue(filters.result),
    masteryValue: toSelectValue(filters.mastery === null ? null : String(filters.mastery)),
    versionValue: toSelectValue(filters.version),
    sort: filters.sort,
    tiers: filters.tiers,
    types: filters.types,
    nations: filters.nations,
    tags: filters.tags,
    mapItems,
    modeItems,
    resultItems,
    sortItems,
    masteryItems,
    versionItems,
    tagOptions,
    minimums,
    isFiltered: hasActiveFilters({ ...filters, player: playerDraft, clan: clanDraft }),
    onVehicleChange: (next: VehicleSummary | null) => update({ tank: next?.tankId ?? null }),
    onMapChange: (value: string) => update({ map: fromSelectValue(value) }),
    onModeChange: (value: string) => update({ mode: fromSelectValue(value) }),
    onResultChange: (value: string) => update({ result: REPLAY_RESULTS.find((result): result is ReplayResult => result === value) ?? null }),
    onSortChange: (sort: ReplaySort) => update({ sort }),
    onPlayerChange: (player: string) => update({ player }),
    onClanChange: (clan: string) => update({ clan }),
    onTiersChange: (tiers: number[]) => update({ tiers }),
    onTypesChange: (types: TankClass[]) => update({ types }),
    onNationsChange: (nations: Nation[]) => update({ nations }),
    onMasteryChange: (value: string) => update({ mastery: REPLAY_MASTERY_LEVELS.find((level) => String(level) === value) ?? null }),
    onVersionChange: (value: string) => update({ version: fromSelectValue(value) }),
    onTagsChange: (tags: ReplayTag[]) => update({ tags }),
    onMinimumChange: ({ key, value }: MinimumChange) => update({ [key]: value }),
    onReset: reset
  };
};
