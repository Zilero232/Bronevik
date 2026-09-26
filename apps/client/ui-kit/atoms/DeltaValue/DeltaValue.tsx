'use client';

import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import { deltaVerdict } from '@/shared/lib';

import type { DeltaValueProps } from './DeltaValue.types';

import s from './DeltaValue.module.scss';

export const DeltaValue = ({
  value,
  verdict,
  isLowerBetter = false,
  isSameShown = false,
  format = 'signed',
  suffix = '',
  className
}: DeltaValueProps) => {
  const formatter = useFormatter();
  const resolved = verdict ?? deltaVerdict({ value, isLowerBetter });
  const shown = resolved === 'same' ? 0 : value;

  return (
    <span className={clsx(s.root, className)} data-verdict={resolved}>
      {(resolved !== 'same' || isSameShown) &&
        `${typeof format === 'string' ? formatter.number(shown, format) : formatter.number(shown, { signDisplay: 'exceptZero', maximumFractionDigits: 2, ...format })}${suffix}`}
    </span>
  );
};
