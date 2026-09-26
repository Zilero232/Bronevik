'use client';

import { useFormatter } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';

import type { RatingCellProps } from './RatingCell.types';

import s from './RatingCell.module.scss';

export const RatingCell = ({ rating }: RatingCellProps) => {
  const format = useFormatter();

  return rating.value === null ? (
    <span className={s.root}>—</span>
  ) : (
    <span className={s.root} data-tone={ratingValueTone(rating)}>
      {format.number(Math.round(rating.value))}
    </span>
  );
};
