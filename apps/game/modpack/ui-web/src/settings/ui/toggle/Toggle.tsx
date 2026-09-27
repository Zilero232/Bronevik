import clsx from 'clsx';

import type { ToggleProps } from './Toggle.types';

import s from './Toggle.module.scss';

export const Toggle = ({ on, label, onToggle }: ToggleProps) => (
  <button aria-label={label} aria-pressed={on} className={clsx(s.toggle, on && s.toggleOn)} type='button' onClick={onToggle}>
    <span className={clsx(s.knob, on && s.knobOn)} />
  </button>
);
