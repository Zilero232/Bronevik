import clsx from 'clsx';

import type { ClientIconProps } from './ClientIcon.types';

import { parseIcon } from '../../../lib/hud-icon';
import { Glyph } from '../Glyph';

import s from './ClientIcon.module.scss';

export const ClientIcon = ({ icon, size, width, className }: ClientIconProps) => {
  const { image, glyph } = parseIcon(icon);

  if (image) {
    return (
      <img
        alt=''
        className={clsx(s.icon, className)}
        height={size}
        src={image}
        style={{ width: `${width ?? size}rem`, height: `${size}rem` }}
        width={width ?? size}
      />
    );
  }

  return glyph ? <Glyph className={clsx(s.icon, className)} name={glyph} size={size} /> : null;
};
