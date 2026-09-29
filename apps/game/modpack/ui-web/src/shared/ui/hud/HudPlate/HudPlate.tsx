import clsx from 'clsx';

import type { HudPlateProps } from './HudPlate.types';

import s from './HudPlate.module.scss';

export const HudPlate = ({ rail, plain = false, flash = false, className, children }: HudPlateProps) => (
  <div className={clsx(s.plate, plain && s.plain, flash && s.flash, rail && s.rail, rail && s[rail], className)}>{children}</div>
);
