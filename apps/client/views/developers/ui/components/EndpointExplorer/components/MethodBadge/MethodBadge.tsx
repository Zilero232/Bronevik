import { clsx } from 'clsx';

import type { MethodBadgeProps } from './MethodBadge.types';

import s from './MethodBadge.module.scss';

export const MethodBadge = ({ method, className }: MethodBadgeProps) => (
  <span className={clsx(s.root, className)} data-method={method}>
    {method}
  </span>
);
