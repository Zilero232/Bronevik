'use client';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { SummaryChipProps } from './SummaryChip.types';

import s from './SummaryChip.module.scss';

export const SummaryChip = ({ row }: SummaryChipProps) => {
  const format = useSpecFormat();

  const { key, a, delta, verdict } = row;

  return (
    <span className={s.root}>
      <span className={s.label}>{format.label(key)}</span>
      <span className={s.value}>
        {format.value({ key, value: a })}
        <DeltaValue
          className={s.delta}
          format={{ maximumFractionDigits: Math.min(TANK_SPECS[key].digits, 1) }}
          value={delta ?? 0}
          verdict={verdict}
        />
      </span>
    </span>
  );
};
