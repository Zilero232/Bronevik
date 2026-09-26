'use client';

import { isNumber } from 'remeda';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';

import type { PatchChangeRow } from '../../../lib';

export const usePatchChange = (change: PatchChangeRow) => {
  const spec = useSpecFormat();

  const { key, specKey, before, after } = change;

  const show = (raw: PatchChangeRow['before']) => (isNumber(raw) || raw === null ? spec.value({ key: specKey ?? key, value: raw }) : String(raw));

  return {
    label: specKey ? spec.label(specKey) : key,
    before: show(before),
    after: show(after),
    unit: specKey ? spec.unit(specKey) : '',
    digits: specKey ? TANK_SPECS[specKey].digits : 2
  };
};
