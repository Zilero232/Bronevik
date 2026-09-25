import { clsx } from 'clsx';

import { RATING_TONES } from '@/shared/lib';

import type { RatingBadgeProps } from './RatingBadge.types';

import s from './RatingBadge.module.scss';

const PIP_HEIGHTS = [4, 5.5, 7, 8.5, 10, 11.5] as const;

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
            {PIP_HEIGHTS.map((height, index) => (
              <span key={height} className={s.pip} data-on={index <= level} style={{ height }} />
            ))}
          </span>
        )}
      </span>
    </span>
  );
};
