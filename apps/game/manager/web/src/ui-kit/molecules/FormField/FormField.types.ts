import type { ReactElement } from 'react';

export type FormFieldControlProps = {
  id: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

export type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: (control: FormFieldControlProps) => ReactElement;
};
