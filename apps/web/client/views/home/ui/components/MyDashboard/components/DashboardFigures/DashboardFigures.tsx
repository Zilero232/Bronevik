'use client';

import { KeyFigure } from '@/ui-kit';

import type { DashboardFiguresProps } from './DashboardFigures.types';

import { useDashboardFigures } from '../../../../../model/hooks';

import s from './DashboardFigures.module.scss';

export const DashboardFigures = ({ overall, week }: DashboardFiguresProps) => {
  const figures = useDashboardFigures({ overall, week });

  return (
    <div className={s.root}>
      {figures.map(({ key, ...figure }) => (
        <KeyFigure isFramed key={key} className={s.figure} size='lg' {...figure} />
      ))}
    </div>
  );
};
