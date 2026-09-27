import type { ReactNode } from 'react';

export type FormFieldProps = {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  className?: string;
};
