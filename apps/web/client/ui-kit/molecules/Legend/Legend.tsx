import { clsx } from 'clsx';

import type { LegendProps } from './Legend.types';

import s from './Legend.module.scss';

export const Legend = ({ items, className, 'aria-label': ariaLabel }: LegendProps) => (
  <ul aria-label={ariaLabel} className={clsx(s.root, className)}>
    {items.map(({ key, tone, label }) => (
      <li key={key} className={s.item}>
        <span aria-hidden className={s.swatch} data-tone={tone} />
        {label}
      </li>
    ))}
  </ul>
);
