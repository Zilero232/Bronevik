'use client';

import { clsx } from 'clsx';

import { FormControlContext, useFormField } from '@/shared/lib';

import type { FilterFieldProps } from './FilterField.types';

import s from './FilterField.module.scss';

export const FilterField = ({ label, children, hint, count = 0, size = 'auto', htmlFor, className }: FilterFieldProps) => {
  const { controlId, labelId, hintId, control } = useFormField({ htmlFor, hasHint: Boolean(hint), hasError: false });

  return (
    <div aria-labelledby={labelId} className={clsx(s.root, s[size], className)} role='group'>
      <div className={s.head}>
        <label className={s.label} htmlFor={controlId} id={labelId}>
          {label}
        </label>
        {count > 0 && (
          <span aria-hidden className={s.count}>
            {count}
          </span>
        )}
        {hint && (
          <span className={s.hint} id={hintId} title={hint}>
            {hint}
          </span>
        )}
      </div>
      <FormControlContext value={control}>{children}</FormControlContext>
    </div>
  );
};
