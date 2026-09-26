import type { IconBaseProps } from '../icon';

import { ICON_DEFAULTS } from '../icon';
import { resolveStroke } from '../resolve-stroke';

export const IconBase = ({
  name,
  children,
  size = ICON_DEFAULTS.size,
  strokeWidth = ICON_DEFAULTS.strokeWidth,
  absoluteStrokeWidth = false,
  color = 'currentColor',
  title,
  className,
  ...props
}: IconBaseProps) => (
  <svg
    aria-hidden={title ? undefined : true}
    className={['otmetki-icon', `otmetki-icon-${name}`, className].filter(Boolean).join(' ')}
    fill='none'
    height={size}
    role={title ? 'img' : undefined}
    stroke={color}
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={resolveStroke({ size, strokeWidth, absoluteStrokeWidth })}
    viewBox={`0 0 ${ICON_DEFAULTS.viewBox} ${ICON_DEFAULTS.viewBox}`}
    width={size}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);
