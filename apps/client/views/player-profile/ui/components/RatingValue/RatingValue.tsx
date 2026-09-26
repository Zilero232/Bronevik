'use client';

import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';

import type { RatingValueProps } from './RatingValue.types';

import s from './RatingValue.module.scss';

export const RatingValue = ({ rating, className }: RatingValueProps) => {
  const format = useFormatter();

  return (
    <span className={clsx(s.root, className)} data-tone={rating.value === null ? undefined : ratingValueTone(rating)}>
      {rating.value === null ? '—' : format.number(rating.value, { maximumFractionDigits: 0 })}
    </span>
  );
};
