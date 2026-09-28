'use client';

import { clsx } from 'clsx';

import { useFormControl } from '@/shared/lib';

import type { TextareaProps } from './Textarea.types';

import s from './Textarea.module.scss';

export const Textarea = ({ isInvalid = false, className, rows = 4, ...props }: TextareaProps) => {
  const control = useFormControl();

  return (
    <textarea
      {...control}
      aria-invalid={isInvalid || control['aria-invalid'] || undefined}
      className={clsx(s.root, className)}
      data-invalid={isInvalid}
      rows={rows}
      {...props}
    />
  );
};
