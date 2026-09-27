import type { InputHTMLAttributes } from 'preact';

export type InputVariant = 'code' | 'default' | 'wide';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> & {
  variant?: InputVariant;
  className?: string;
};
