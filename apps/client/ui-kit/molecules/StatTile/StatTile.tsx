import { clsx } from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';

import type { StatTileProps } from './StatTile.types';

import { AnimatedNumber } from '../../atoms';
import { Sparkline } from '../Sparkline';

import s from './StatTile.module.scss';

export const StatTile = ({
  label,
  value,
  format,
  prefix,
  suffix,
  delta,
  deltaLabel,
  icon,
  trend,
  tone = 'accent',
  hint,
  className
}: StatTileProps) => {
  const isUp = (delta ?? 0) >= 0;

  return (
    <div className={clsx(s.root, className)} data-tone={tone}>
      <div className={s.head}>
        <span className={s.label}>{label}</span>
        {icon && (
          <span aria-hidden className={s.icon}>
            {icon}
          </span>
        )}
      </div>
      <div className={s.value}>
        <AnimatedNumber format={format} prefix={prefix} suffix={suffix} value={value} />
      </div>
      <div className={s.foot}>
        {delta !== undefined && (
          <span className={s.delta} data-direction={isUp ? 'up' : 'down'}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {deltaLabel ?? `${isUp ? '+' : ''}${delta}`}
          </span>
        )}
        {hint && <span className={s.hint}>{hint}</span>}
        {trend && <Sparkline className={s.spark} data={trend} height={28} tone={tone} width={96} />}
      </div>
    </div>
  );
};
