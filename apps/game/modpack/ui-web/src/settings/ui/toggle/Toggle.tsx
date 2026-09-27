import clsx from 'clsx';

import type { ToggleProps } from './Toggle.types';

export const Toggle = ({ on, label, onToggle }: ToggleProps) => (
  <button aria-label={label} aria-pressed={on} className={clsx('toggle', on && 'toggle--on')} type='button' onClick={onToggle}>
    <span className='toggle__knob' />
  </button>
);
