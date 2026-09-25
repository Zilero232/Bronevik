'use client';

import { ArrowRight } from 'lucide-react';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { PatchChangeProps } from './PatchChange.types';

import s from './PatchChange.module.scss';

export const PatchChange = ({ change }: PatchChangeProps) => {
  const { value, unit, label } = useSpecFormat();

  const { key, specKey, before, after, delta, verdict } = change;
  const suffix = specKey ? unit(specKey) : '';
  const digits = specKey ? TANK_SPECS[specKey].digits : 2;
  const show = (raw: typeof before) => (typeof raw === 'number' || raw === null ? value({ key: specKey ?? key, value: raw }) : String(raw));

  return (
    <li className={s.root} data-verdict={verdict}>
      <span className={s.label}>{specKey ? label(specKey) : key}</span>
      <span className={s.values}>
        <span className={s.before}>{show(before)}</span>
        <ArrowRight aria-hidden className={s.arrow} size={14} />
        <span className={s.after}>{show(after)}</span>
        {suffix && <span className={s.unit}>{suffix}</span>}
      </span>
      <span className={s.delta}>
        {delta !== null && <DeltaValue format={{ maximumFractionDigits: digits }} suffix={suffix && ` ${suffix}`} value={delta} verdict={verdict} />}
      </span>
    </li>
  );
};
