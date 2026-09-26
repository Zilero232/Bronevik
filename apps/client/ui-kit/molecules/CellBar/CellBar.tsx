import { clsx } from 'clsx';
import { clamp } from 'remeda';

import type { CellBarProps } from './CellBar.types';

import s from './CellBar.module.scss';

export const CellBar = ({ value, max, tone = 'accent', children, className }: CellBarProps) => {
  const ratio = max > 0 ? clamp(value / max, { min: 0, max: 1 }) : 0;

  return (
    <span className={clsx(s.root, className)} data-tone={tone}>
      <span className={s.value}>{children}</span>
      <span aria-hidden className={s.track}>
        <span className={s.fill} style={{ scale: `${ratio} 1` }} />
      </span>
    </span>
  );
};
