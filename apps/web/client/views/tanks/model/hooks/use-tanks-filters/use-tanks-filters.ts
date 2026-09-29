'use client';

import type { LearningDifficulty } from '@otmetki/schemas';

import { LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { shortList } from '@/shared/lib';

import { TANKS_VIEW } from '../../../config';
import { useTanksPresets } from '../use-tanks-presets';
import { useTanksState } from '../use-tanks-state';

export const useTanksFilters = () => {
  const t = useTranslations('tankTraits');
  const tPresets = useTranslations('tanks.presets');
  const tFilters = useTranslations('common.filters');
  const [{ view, difficulties, top, pinned }, setState] = useTanksState();
  const presets = useTanksPresets();

  const active: ActiveFilter[] = [
    ...(difficulties.length > 0
      ? [
          {
            id: 'difficulties',
            label: tFilters('span', {
              label: t('difficulty.label'),
              value: shortList({ items: difficulties.map((value) => t(`difficulty.${value}`)), max: TANKS_VIEW.chipItems })
            }),
            onRemove: () => void setState({ difficulties: null })
          }
        ]
      : []),
    ...(top ? [{ id: 'top', label: tPresets('top10'), onRemove: () => void setState({ top: null }) }] : []),
    ...(pinned ? [{ id: 'pinned', label: tPresets('pinned'), onRemove: () => void setState({ pinned: null }) }] : [])
  ];

  return {
    isTable: view === 'table',
    difficulties,
    difficultyOptions: LEARNING_DIFFICULTIES.map((value) => ({ value, label: t(`difficulty.${value}`) })),
    presets,
    active,
    onDifficultiesChange: (next: LearningDifficulty[]) => void setState({ difficulties: next.length > 0 ? next : null }),
    onReset: () => void setState({ difficulties: null, top: null, pinned: null })
  };
};
