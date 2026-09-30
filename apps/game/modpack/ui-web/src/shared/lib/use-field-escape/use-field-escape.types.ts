import type { InputHTMLAttributes } from 'react';

export type FieldFocusHandlers = Pick<InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'onFocus'>;

export type UseFieldEscapeInput = FieldFocusHandlers & {
  onEscape?: () => void;
};
