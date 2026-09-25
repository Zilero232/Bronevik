'use client';

import { TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { AnimatedNumber, DeltaValue } from '@/ui-kit';

import type { SummaryChipProps } from './SummaryChip.types';

import { BUILD_VIEW } from '../../../../../config';

import s from './SummaryChip.module.scss';

export const SummaryChip = ({ row }: SummaryChipProps) => {
  const format = useSpecFormat();

  const { key, a, delta, verdict } = row;
  const { digits } = TANK_SPECS[key];

  return (
    <span className={s.root}>
      <span className={s.label}>{format.label(key)}</span>
      <span className={s.value}>
        {a !== null && (
          <AnimatedNumber duration={BUILD_VIEW.statDuration} format={{ maximumFractionDigits: Math.min(digits, 1) }} from={a} value={a} />
        )}
        <DeltaValue className={s.delta} format={{ maximumFractionDigits: Math.min(digits, 1) }} value={delta ?? 0} verdict={verdict} />
      </span>
    </span>
  );
};
