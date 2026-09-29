'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { activePresets, presetsPatch } from '@/shared/lib';

import type { MarksPresetId } from './use-marks-presets.types';

import { MARKS_PRESET_PARSERS, MARKS_PRESETS } from '../../../config';

export const useMarksPresets = () => {
  const t = useTranslations('marks.presets');
  const [state, setState] = useQueryStates(MARKS_PRESET_PARSERS, { history: 'replace' });

  const active = activePresets({ presets: MARKS_PRESETS, state });

  return {
    options: MARKS_PRESETS.map(({ id }) => ({ value: id, label: t(id) })),
    active,
    onChange: (next: MarksPresetId[]) => void setState(presetsPatch({ presets: MARKS_PRESETS, active, next }))
  };
};
