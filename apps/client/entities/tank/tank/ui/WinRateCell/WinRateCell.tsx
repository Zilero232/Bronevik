import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import { percentText, ratingTone } from '@/shared/lib';

import type { WinRateCellProps } from './WinRateCell.types';

import s from './WinRateCell.module.scss';

export const WinRateCell = ({ value, digits = 2, className }: WinRateCellProps) => {
  const format = useFormatter();

  return (
    <span className={clsx(s.root, className)} data-tone={value === null ? undefined : ratingTone({ scale: 'winRate', value })}>
      {percentText({ format, value, digits })}
    </span>
  );
};
