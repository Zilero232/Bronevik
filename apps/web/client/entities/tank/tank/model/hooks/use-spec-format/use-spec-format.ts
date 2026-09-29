'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { TankSpecKey } from '../../../model/tank-specs.types';
import type { FormatSpecInput } from './use-spec-format.types';

import { TANK_SPEC_FORMAT } from '../../../config';
import { specMeta } from '../../../lib/spec-meta';

export const useSpecFormat = () => {
  const t = useTranslations('tank');
  const format = useFormatter();

  const value = ({ key, value: raw }: FormatSpecInput) => {
    if (raw === null || raw === undefined) {
      return TANK_SPEC_FORMAT.missing;
    }

    const digits = specMeta(key)?.digits ?? TANK_SPEC_FORMAT.fallbackDigits;

    return format.number(raw, { maximumFractionDigits: digits, minimumFractionDigits: Math.min(digits, 1) });
  };

  const unit = (key: string) => {
    const meta = specMeta(key);

    return meta && meta.unit !== 'none' ? t(`units.${meta.unit}`) : '';
  };

  const label = (key: TankSpecKey) => t(`specs.${key}`);

  return { value, unit, label };
};
