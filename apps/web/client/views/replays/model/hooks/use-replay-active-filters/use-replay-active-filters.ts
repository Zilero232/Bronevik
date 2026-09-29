'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { useReplayModeLabel } from '@/features/community/replay-meta';
import { shortList, tierSpanText } from '@/shared/lib';

import type { ReplayFiltersPatch } from '../use-replay-filters/use-replay-filters.types';
import type { UseReplayActiveFiltersInput } from './use-replay-active-filters.types';

import { REPLAY_LIST, REPLAY_MINIMUMS, REPLAY_TIERS } from '../../../config';

export const useReplayActiveFilters = ({
  filters,
  playerDraft,
  clanDraft,
  update,
  vehicleName,
  mapName,
  masteryItems
}: UseReplayActiveFiltersInput): ActiveFilter[] => {
  const t = useTranslations('replays.filters');
  const tTags = useTranslations('replays.tags');
  const tGame = useTranslations('game');
  const tFilters = useTranslations('common.filters');
  const format = useFormatter();
  const modeLabel = useReplayModeLabel();

  const clear =
    (patch: ReplayFiltersPatch): (() => void) =>
    () =>
      update(patch);

  return [
    ...(filters.tank === null
      ? []
      : [
          {
            id: 'tank',
            label: tFilters('span', { label: t('tank'), value: vehicleName ?? String(filters.tank) }),
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
};
