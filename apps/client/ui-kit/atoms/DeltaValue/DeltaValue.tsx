'use client';

import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import { deltaVerdict } from '@/shared/lib';

import type { DeltaValueProps } from './DeltaValue.types';

import s from './DeltaValue.module.scss';

export const DeltaValue = ({ value, verdict, isLowerBetter = false, format = 'signed', suffix = '', className }: DeltaValueProps) => {
  const formatter = useFormatter();
  const resolved = verdict ?? deltaVerdict({ value, isLowerBetter });

  return (
    <span className={clsx(s.root, className)} data-verdict={resolved}>
      {resolved !== 'same' &&
        `${typeof format === 'string' ? formatter.number(value, format) : formatter.number(value, { signDisplay: 'exceptZero', maximumFractionDigits: 2, ...format })}${suffix}`}
    </span>
  );
};
