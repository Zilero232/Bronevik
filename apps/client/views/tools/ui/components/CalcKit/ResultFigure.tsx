'use client';

import { AnimatedNumber } from '@/ui-kit';

import type { ResultFigureProps } from './CalcKit.types';

import s from './CalcKit.module.scss';

export const ResultFigure = ({ label, value, fallback, suffix, format, hint, tone = 'accent', size = 'lg' }: ResultFigureProps) => (
  <div className={s.figure} data-size={size} data-tone={tone}>
    <span className={s.figureLabel}>{label}</span>
    {value === null ? (
      <span className={s.fallback}>{fallback ?? '—'}</span>
    ) : (
      <AnimatedNumber className={s.figureValue} duration={0.8} format={format} suffix={suffix} value={value} />
    )}
    {hint && <span className={s.figureHint}>{hint}</span>}
  </div>
);
