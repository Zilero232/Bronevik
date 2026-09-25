'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { TankSpecKey, TankSpecMeta } from '../../../config';
import type { FormatSpecInput } from './use-spec-format.types';

import { TANK_SPECS } from '../../../config';

const metaOf = (key: string): TankSpecMeta | undefined => Object.entries(TANK_SPECS).find(([candidate]) => candidate === key)?.[1];

export const useSpecFormat = () => {
  const t = useTranslations('tank');
  const format = useFormatter();

  const value = ({ key, value: raw }: FormatSpecInput) => {
    if (raw === null || raw === undefined) {
      return '—';
    }

    const meta = metaOf(key);
    const digits = meta?.digits ?? 2;

    return format.number(raw, { maximumFractionDigits: digits, minimumFractionDigits: Math.min(digits, 1) });
  };

  const unit = (key: string) => {
    const meta = metaOf(key);

    return meta && meta.unit !== 'none' ? t(`units.${meta.unit}`) : '';
  };

  const label = (key: TankSpecKey) => t(`specs.${key}`);

  return { value, unit, label };
};
