import { clsx } from 'clsx';

import type { FormFieldProps } from './FormField.types';

import s from './FormField.module.scss';

export const FormField = ({ label, hint, error, children, className }: FormFieldProps) => (
  <label className={clsx(s.root, className)}>
    <span className={s.label}>{label}</span>
    {children}
    {error && (
      <span className={s.error} role='alert'>
        {error}
      </span>
    )}
    {!error && hint && <span className={s.hint}>{hint}</span>}
  </label>
);
