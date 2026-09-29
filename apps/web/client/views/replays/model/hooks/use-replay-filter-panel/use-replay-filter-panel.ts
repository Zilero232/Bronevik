'use client';

import type { Nation, TankClass } from '@otmetki/icons';
import type { ReplayTag, VehicleSummary } from '@otmetki/schemas';

import { REPLAY_MASTERY_LEVELS, REPLAY_TAG_RULES, REPLAY_TAGS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import type { ActiveFilter, SelectItem } from '@/ui-kit';

import { mapQueries } from '@/entities/map/map';
import { useReplayModeLabel } from '@/features/community/replay-meta';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { shortList, tierSpanText } from '@/shared/lib';

import type { ReplayResult, ReplaySort } from '../../../lib/replay-query';
import type { ReplayFiltersPatch } from '../use-replay-filters/use-replay-filters.types';
import type { MinimumChange } from './use-replay-filter-panel.types';

import { replayVersionsQuery } from '../../../api';
import { REPLAY_LIST, REPLAY_MINIMUM_STEP, REPLAY_MINIMUMS, REPLAY_RESULTS, REPLAY_SORTS, REPLAY_TIERS } from '../../../config';
import { replayModeOptions } from '../../../lib/replay-modes';
import { fromSelectValue, toSelectValue } from '../../../lib/replay-query';
import { useReplayFilters } from '../use-replay-filters';

export const useReplayFilterPanel = () => {
  const t = useTranslations('replays.filters');
  const locale = useLocale();
  const tTags = useTranslations('replays.tags');
  const tGame = useTranslations('game');
  const tFilters = useTranslations('common.filters');
  const format = useFormatter();
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

  const mapName = mapList.find((map) => map.arenaId === filters.map)?.name ?? filters.map;
  const clear =
    (patch: ReplayFiltersPatch): (() => void) =>
    () =>
      update(patch);

  const active: ActiveFilter[] = [
    ...(filters.tank === null
      ? []
      : [
          {
            id: 'tank',
            label: tFilters('span', { label: t('tank'), value: vehicle?.shortName ?? String(filters.tank) }),
            onRemove: clear({ tank: null })
          }
        ]),
    ...(filters.map === null
      ? []
      : [{ id: 'map', label: tFilters('span', { label: t('map'), value: mapName ?? '' }), onRemove: clear({ map: null }) }]),
    ...(filters.mode === null
      ? []
      : [{ id: 'mode', label: tFilters('span', { label: t('mode'), value: modeLabel(filters.mode) }), onRemove: clear({ mode: null }) }]),
    ...(playerDraft.trim() === ''
      ? []
      : [{ id: 'player', label: tFilters('span', { label: t('player'), value: playerDraft.trim() }), onRemove: clear({ player: '' }) }]),
    ...(clanDraft.trim() === ''
      ? []
      : [{ id: 'clan', label: tFilters('span', { label: t('clan'), value: clanDraft.trim() }), onRemove: clear({ clan: '' }) }]),
    ...(filters.result === null
      ? []
      : [
          { id: 'result', label: tFilters('span', { label: t('result'), value: t(`results.${filters.result}`) }), onRemove: clear({ result: null }) }
        ]),
    ...(filters.tiers.length === 0
      ? []
      : [
          {
            id: 'tiers',
            label: tFilters('span', { label: t('tier'), value: tierSpanText({ options: REPLAY_TIERS, value: filters.tiers }) }),
            onRemove: clear({ tiers: [] })
          }
        ]),
    ...(filters.types.length === 0
      ? []
      : [
          {
            id: 'types',
            label: tFilters('span', {
              label: t('type'),
              value: shortList({ items: filters.types.map((type) => tGame(`classes.${type}`)), max: REPLAY_LIST.chipItems })
            }),
            onRemove: clear({ types: [] })
          }
        ]),
    ...(filters.nations.length === 0
      ? []
      : [
          {
            id: 'nations',
            label: tFilters('span', {
              label: t('nation'),
              value: shortList({ items: filters.nations.map((nation) => tGame(`nations.${nation}`)), max: REPLAY_LIST.chipItems })
            }),
            onRemove: clear({ nations: [] })
          }
        ]),
    ...REPLAY_MINIMUMS.flatMap((key) => {
      const value = filters[key];

      return value === null
        ? []
        : [{ id: key, label: tFilters('pair', { label: t(`minimums.${key}`), value: format.number(value) }), onRemove: clear({ [key]: null }) }];
    }),
    ...(filters.mastery === null
      ? []
      : [
          {
            id: 'mastery',
            label: tFilters('span', {
              label: t('masteryLabel'),
              value: masteryItems.find((item) => item.value === String(filters.mastery))?.label ?? String(filters.mastery)
            }),
            onRemove: clear({ mastery: null })
          }
        ]),
    ...(filters.version === null
      ? []
      : [{ id: 'version', label: tFilters('span', { label: t('version'), value: filters.version }), onRemove: clear({ version: null }) }]),
    ...(filters.tags.length === 0
      ? []
      : [
          {
            id: 'tags',
            label: tFilters('span', {
              label: t('tags'),
              value: shortList({ items: filters.tags.map((tag) => tTags(`${tag}.label`)), max: REPLAY_LIST.chipItems })
            }),
            onRemove: clear({ tags: [] })
          }
        ])
  ];

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
    active,
    advancedCount: [
      filters.tiers.length > 0,
      filters.types.length > 0,
      filters.nations.length > 0,
      clanDraft.trim() !== '',
      filters.mastery !== null,
      filters.version !== null,
      filters.tags.length > 0,
      ...REPLAY_MINIMUMS.map((key) => filters[key] !== null)
    ].filter(Boolean).length,
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
