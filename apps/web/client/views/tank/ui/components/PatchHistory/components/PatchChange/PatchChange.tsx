'use client';

import { ArrowRight } from 'lucide-react';

import { DeltaValue } from '@/ui-kit';

import type { PatchChangeProps } from './PatchChange.types';

import { usePatchChange } from '../../../../../model/hooks';

import s from './PatchChange.module.scss';

export const PatchChange = ({ change }: PatchChangeProps) => {
  const { label, before, after, unit, digits } = usePatchChange(change);

  return (
    <li className={s.root} data-verdict={change.verdict}>
      <span className={s.label}>{label}</span>
      <span className={s.values}>
        <span className={s.before}>{before}</span>
        <ArrowRight aria-hidden className={s.arrow} size={14} />
        <span className={s.after}>{after}</span>
        {unit && <span className={s.unit}>{unit}</span>}
      </span>
      <span className={s.delta}>
        {change.delta !== null && (
          <DeltaValue format={{ maximumFractionDigits: digits }} suffix={unit && `\u00A0${unit}`} value={change.delta} verdict={change.verdict} />
        )}
      </span>
    </li>
  );
};
