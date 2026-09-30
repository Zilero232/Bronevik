import type { InputHTMLAttributes } from 'preact';

import type { UiIconName } from '../../lib/icon-sprite';

export type InputVariant = 'code' | 'default' | 'wide';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'placeholder' | 'type' | 'value'> & {
  variant?: InputVariant;
  className?: string;
  placeholder?: string;
  icon?: UiIconName;
  value: string;
};
