import { clsx } from 'clsx';

import type { FormFieldProps } from './FormField.types';

import s from './FormField.module.scss';

export const FormField = ({ label, children, hint, error, htmlFor, className }: FormFieldProps) => (
  <div className={clsx(s.root, className)}>
    <label className={s.label} htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {error ? (
      <p className={s.error} role='alert'>
        {error}
      </p>
    ) : (
      hint && <p className={s.hint}>{hint}</p>
    )}
  </div>
);
