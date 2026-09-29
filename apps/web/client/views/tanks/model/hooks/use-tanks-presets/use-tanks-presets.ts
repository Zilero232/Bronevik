'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { activePresets, presetsPatch } from '@/shared/lib';

import type { TanksPresetId } from './use-tanks-presets.types';

import { TANKS_PRESET_PARSERS, TANKS_PRESETS } from '../../../config';

export const useTanksPresets = () => {
  const t = useTranslations('tanks.presets');
  const [state, setState] = useQueryStates(TANKS_PRESET_PARSERS, { history: 'replace' });

  const active = activePresets({ presets: TANKS_PRESETS, state });

  return {
    options: TANKS_PRESETS.map(({ id }) => ({ value: id, label: t(id) })),
    active,
    onChange: (next: TanksPresetId[]) => void setState(presetsPatch({ presets: TANKS_PRESETS, active, next }))
  };
};
