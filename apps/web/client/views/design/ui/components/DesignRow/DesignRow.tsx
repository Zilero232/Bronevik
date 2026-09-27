import { clsx } from 'clsx';

import type { DesignRowProps } from './DesignRow.types';

import s from './DesignRow.module.scss';

export const DesignRow = ({ label, className, children }: DesignRowProps) => (
  <div className={s.row}>
    <span className={s.label}>{label}</span>
    <div className={clsx(s.items, className)}>{children}</div>
  </div>
);
