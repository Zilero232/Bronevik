'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { TankMathPreset } from './use-tank-math.types';

import { TANK_MATH_PRESETS } from '../../../config';
import { useTankMathData } from '../use-tank-math-data';

export const useTankMath = (tankId: number) => {
  const t = useTranslations('tankMath.presets');
  const [preset, setPreset] = useState<TankMathPreset>('top');
  const query = useTankMathData(tankId);
  const { data } = query;

  const presets = TANK_MATH_PRESETS.map((value) => ({ value, label: t(value) }));
  const otherPreset: TankMathPreset = preset === 'top' ? 'stock' : 'top';

  return {
    query,
    preset,
    presets,
    setPreset,
    config: data ? data[preset] : null,
    other: data ? data[otherPreset] : null
  };
};
