import { AnimatedNumber } from '@/ui-kit';

import type { WrappedFactProps } from './WrappedFact.types';

import s from './WrappedFact.module.scss';

export const WrappedFact = ({ label, value, isHero = false }: WrappedFactProps) => (
  <div className={s.root} data-hero={isHero}>
    <span className={s.value}>{typeof value === 'number' ? <AnimatedNumber format={{ maximumFractionDigits: 0 }} value={value} /> : value}</span>
    <span className={s.label}>{label}</span>
  </div>
);
