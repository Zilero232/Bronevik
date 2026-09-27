import { useId } from 'react';

import type { FormFieldProps } from './FormField.types';

import s from './FormField.module.scss';

export const FormField = ({ label, hint, error, children }: FormFieldProps) => {
  const id = useId();
  const messageId = useId();
  const message = error ?? hint;

  return (
    <div className={s.root}>
      <label className={s.label} htmlFor={id}>
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': message ? messageId : undefined })}
      {message && (
        <p className={error ? s.error : s.hint} id={messageId} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
};
