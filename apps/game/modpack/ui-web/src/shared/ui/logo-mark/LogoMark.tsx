import { ICON_DEFAULTS, LOGO_SHAPES } from '@otmetki/icons/shapes';

import type { LogoMarkProps } from './LogoMark.types';

export const LogoMark = ({ size, className }: LogoMarkProps) => (
  <svg
    aria-hidden='true'
    className={className}
    fill='none'
    height={size}
    stroke='currentColor'
    stroke-linecap='round'
    stroke-linejoin='round'
    stroke-width={ICON_DEFAULTS.strokeWidth}
    viewBox={`0 0 ${ICON_DEFAULTS.viewBox} ${ICON_DEFAULTS.viewBox}`}
    width={size}
    xmlns='http://www.w3.org/2000/svg'
  >
    {LOGO_SHAPES.marks.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);
