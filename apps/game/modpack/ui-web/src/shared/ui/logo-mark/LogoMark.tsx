import { ICON_DEFAULTS, LOGO_SHAPES } from '@otmetki/icons/shapes';
import clsx from 'clsx';

import type { LogoMarkProps } from './LogoMark.types';

import s from './LogoMark.module.scss';

export const LogoMark = ({ size, className }: LogoMarkProps) => (
  <span className={clsx(s.mark, className)} style={{ width: `${size}rem`, height: `${size}rem` }}>
    <svg
      aria-hidden='true'
      fill='none'
      height='100%'
      stroke='currentColor'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width={ICON_DEFAULTS.strokeWidth}
      viewBox={`0 0 ${ICON_DEFAULTS.viewBox} ${ICON_DEFAULTS.viewBox}`}
      width='100%'
      xmlns='http://www.w3.org/2000/svg'
    >
      {LOGO_SHAPES.marks.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  </span>
);
