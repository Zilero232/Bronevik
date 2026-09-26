import { Skeleton } from '@/ui-kit';

import type { TextFigureProps } from './TextFigure.types';

import s from './TextFigure.module.scss';

export const TextFigure = ({ label, value, isLoading = false }: TextFigureProps) => (
  <div className={s.root}>
    <span className={s.label}>{label}</span>
    <span className={s.value}>{isLoading ? <Skeleton height={24} width={96} /> : value}</span>
  </div>
);
