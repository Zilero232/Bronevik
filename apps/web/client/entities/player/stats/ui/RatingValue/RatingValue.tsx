'use client';

import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import type { RatingValueProps } from './RatingValue.types';

import { ratingValueTone } from '../../lib/stats-view';

import s from './RatingValue.module.scss';

export const RatingValue = ({ rating, className }: RatingValueProps) => {
  const format = useFormatter();

  return rating.value === null ? (
    <span data-empty className={clsx(s.root, className)}>
      —
    </span>
  ) : (
    <span className={clsx(s.root, className)} data-tone={ratingValueTone(rating)}>
      {format.number(rating.value, { maximumFractionDigits: 0 })}
    </span>
  );
};
