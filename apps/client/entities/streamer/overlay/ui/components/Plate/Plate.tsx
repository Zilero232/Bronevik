import { clsx } from 'clsx';

import type { PlateProps } from './Plate.types';

import s from './Plate.module.scss';

export const Plate = ({ label, children, aside, className }: PlateProps) => (
  <div className={clsx(s.root, className)}>
    {aside}
    <div className={s.body}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  </div>
);
