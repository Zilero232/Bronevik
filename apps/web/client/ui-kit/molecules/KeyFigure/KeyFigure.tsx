import { clsx } from 'clsx';
import { match, P } from 'ts-pattern';

import type { KeyFigureProps } from './KeyFigure.types';

import { AnimatedNumber, DeltaValue } from '../../atoms';
import { Sparkline } from '../Sparkline';

import s from './KeyFigure.module.scss';

export const KeyFigure = ({
  label,
  value,
  format,
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
  variant = 'plain',
  icon,
  className
}: KeyFigureProps) => (
  <div className={clsx(s.root, s[size], s[variant], isFramed && s.framed, className)} data-tone={tone}>
    <span className={s.head}>
      {icon && (
        <span aria-hidden className={s.icon}>
          {icon}
        </span>
      )}
      <span className={s.label}>{label}</span>
    </span>
    <span className={s.value} data-flow={value === null || value === undefined || typeof value === 'number'}>
      {match(value)
        .with(P.nullish, () => '—')
        .with(P.number, (known) => <AnimatedNumber format={format} prefix={prefix} suffix={suffix} value={known} />)
        .with(P.string, (known) => `${prefix ?? ''}${known}${suffix ?? ''}`)
        .otherwise((node) => node)}
    </span>
    {(delta !== undefined || deltaLabel || hint || trend) && (
      <span className={s.foot}>
        {delta !== undefined && <DeltaValue isLowerBetter={isDeltaLowerBetter} isSameShown={deltaLabel === undefined} value={delta} />}
        {deltaLabel && <span className={s.deltaLabel}>{deltaLabel}</span>}
        {hint && <span className={s.hint}>{hint}</span>}
        {trend && (
          <Sparkline
            className={s.spark}
            data={trend}
            height={variant === 'tile' ? 32 : 20}
            tone={tone}
            width={variant === 'tile' ? 120 : 72}
            withArea={variant === 'tile'}
          />
        )}
      </span>
    )}
  </div>
);
