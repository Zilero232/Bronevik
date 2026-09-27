'use client';

import { clsx } from 'clsx';

import { KeyFigure, KeyFigures } from '@/ui-kit';

import type { StatsTilesProps } from './StatsTiles.types';

import { useStatsTiles } from '../../model/hooks';

import s from './StatsTiles.module.scss';

export const StatsTiles = ({ stats, reference, trends, className }: StatsTilesProps) => {
  const tiles = useStatsTiles({ stats, reference, trends });

  return (
    <KeyFigures className={clsx(s.root, className)}>
      {tiles.map(({ key, ...tile }) => (
        <KeyFigure key={key} {...tile} />
      ))}
    </KeyFigures>
  );
};
