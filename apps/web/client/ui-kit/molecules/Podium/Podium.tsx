import { clsx } from 'clsx';

import type { PodiumProps } from './Podium.types';

import s from './Podium.module.scss';

export const Podium = ({ 'aria-label': ariaLabel, className, children }: PodiumProps) => (
  <ol aria-label={ariaLabel} className={clsx(s.root, className)}>
    {children}
  </ol>
);
