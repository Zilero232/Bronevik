'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { DeltaValue } from '@/ui-kit';

import type { ValueCellProps } from './ValueCell.types';

import { COMPARE_DELTA_FORMAT } from '../../../../../config';
import { displayValue } from '../../../../../lib/compare-rows';

import s from './ValueCell.module.scss';

export const ValueCell = ({ row: { values, best, deltas, tones, format, isLowerBetter }, index }: ValueCellProps) => {
  const t = useTranslations('compare');
  const formatter = useFormatter();

  const value = values[index] ?? null;
  const delta = deltas[index] ?? null;

  return (
    <span className={s.root}>
      <span className={s.value} data-best={best.includes(index)} data-tone={tones[index] ?? undefined}>
        {value === null ? '—' : formatter.number(displayValue({ value, format }), format)}
      </span>
      {best.includes(index) && <span className={s.best}>{t('best')}</span>}
      {delta !== null && (
        <DeltaValue
          className={s.delta}
          format={COMPARE_DELTA_FORMAT[format]}
          isLowerBetter={isLowerBetter}
          value={displayValue({ value: delta, format })}
        />
      )}
    </span>
  );
};
