import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import type { KeyFigureProps } from './KeyFigure.types';

import { DeltaValue } from '../../atoms';
import { Sparkline } from '../Sparkline';

import s from './KeyFigure.module.scss';

export const KeyFigure = ({
  label,
  value,
  format: numberFormat,
  prefix,
  suffix,
  delta,
  deltaLabel,
  isDeltaLowerBetter = false,
  hint,
  trend,
  tone = 'accent',
  size = 'md',
  isFramed = false,
  className
}: KeyFigureProps) => {
  const format = useFormatter();

  return (
    <div className={clsx(s.root, s[size], isFramed && s.framed, className)} data-tone={tone}>
      <span className={s.label}>{label}</span>
      <span className={s.value}>{value === null ? '—' : `${prefix ?? ''}${format.number(value, numberFormat)}${suffix ?? ''}`}</span>
      {(delta !== undefined || hint || trend) && (
        <span className={s.foot}>
          {deltaLabel && <span className={s.deltaLabel}>{deltaLabel}</span>}
          {!deltaLabel && delta !== undefined && <DeltaValue isLowerBetter={isDeltaLowerBetter} value={delta} />}
          {hint && <span className={s.hint}>{hint}</span>}
          {trend && <Sparkline className={s.spark} data={trend} height={20} tone={tone} width={72} />}
        </span>
      )}
    </div>
  );
};
