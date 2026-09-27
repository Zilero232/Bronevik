'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { SelectItem } from '@/ui-kit';

import { mapQueries, useMapLabels } from '@/entities/map/map';

import { BOARD_SETTINGS } from '../../../config';
import { boardModeOptions, findBoardMap } from '../../../lib/board-settings';

export const useTacticMaps = () => {
  const t = useTranslations('tactics.settings');
  const labels = useMapLabels();
  const { data: maps = [], isPending } = useQuery(mapQueries.list());

  const none: SelectItem = { value: BOARD_SETTINGS.none, label: t('none') };
  const mapItems: SelectItem[] = [none, ...maps.map(({ arenaId, name }) => ({ value: arenaId, label: name }))];

  const modeItems = (arenaId: string | null): SelectItem[] => [
    none,
    ...boardModeOptions({ maps, arenaId }).map((mode) => ({ value: mode, label: labels.mode(mode) }))
  ];

  const mapOf = (arenaId: string | null) => findBoardMap({ maps, arenaId });

  return { maps, isPending, mapItems, modeItems, mapOf, modeLabel: labels.mode, camouflageLabel: labels.camouflage };
};
