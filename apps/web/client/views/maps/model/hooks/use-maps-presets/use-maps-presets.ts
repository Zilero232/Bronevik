'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { activePresets, presetsPatch } from '@/shared/lib';

import type { MapsPresetId } from './use-maps-presets.types';

import { MAP_FILTER_PARSERS, MAPS_PRESETS } from '../../../config';

export const useMapsPresets = () => {
  const t = useTranslations('maps.presets');
  const [state, setState] = useQueryStates(MAP_FILTER_PARSERS, { history: 'replace' });

  const active = activePresets({ presets: MAPS_PRESETS, state });

  return {
    options: MAPS_PRESETS.map(({ id }) => ({ value: id, label: t(id) })),
    active,
    onChange: (next: MapsPresetId[]) => void setState(presetsPatch({ presets: MAPS_PRESETS, active, next }))
  };
};
