import type { InputHTMLAttributes } from 'preact';

export type FieldFocusHandlers = Pick<InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'onFocus'>;

export type UseFieldEscapeInput = FieldFocusHandlers & {
  onEscape?: () => void;
};
