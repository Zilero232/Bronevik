import { clsx } from 'clsx';

import { RATING_TONES } from '@/shared/lib';

import type { RatingBadgeProps } from './RatingBadge.types';

import { RATING_BADGE } from './RatingBadge.constants';

import s from './RatingBadge.module.scss';

export const RatingBadge = ({ tone, value, label, size = 'md', withPips = true, className, ...props }: RatingBadgeProps) => {
  const level = RATING_TONES.indexOf(tone);

  return (
    <span className={clsx(s.root, s[tone], s[size], className)} data-tone={tone} {...props}>
      <span aria-hidden className={s.swatch} />
      <span className={s.body}>
        {label && <span className={s.label}>{label}</span>}
        <span className={s.value}>{value}</span>
        {withPips && (
          <span aria-hidden className={s.pips}>
            {RATING_BADGE.pipHeights.map((height, index) => (
              <span key={height} className={s.pip} data-on={index <= level} style={{ height }} />
            ))}
          </span>
        )}
      </span>
    </span>
  );
};
