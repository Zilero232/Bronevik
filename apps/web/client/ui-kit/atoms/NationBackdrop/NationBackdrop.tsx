import { isNation, NationFlag } from '@otmetki/icons';
import { clsx } from 'clsx';

import type { NationBackdropProps } from './NationBackdrop.types';

import s from './NationBackdrop.module.scss';

export const NationBackdrop = ({ nation, fade = 'radial', className }: NationBackdropProps) => (
  <span aria-hidden className={clsx(s.root, s[fade], className)} data-nation={nation}>
    {isNation(nation) && <NationFlag className={s.flag} nation={nation} />}
  </span>
);
